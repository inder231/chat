const createError = require("http-errors");
const redisClient = require("../config/redis");

module.exports = {
  authorizeUser: (socket, next) => {
    console.log("authorizeUser");
    if (!socket.request.session || !socket.request?.session?.user) {
      console.log("Bad request");
      return next(createError(401, "Not authorized!"));
    }
    next();
  },
  initializeUser: async (socket) => {
    // store user in socket
    socket.user = { ...socket.request?.session?.user };
    // join the room
    socket.join(socket.user.id);
    // store user user name <--> userId in redis( hset ) so that if someone make a request to add friend we can access that easily.
    await redisClient.hset(
      `userId:${socket.user?.username}`,
      "userId",
      socket.user.id,
      "connected",
      1
    );
    // get user's friends list
    const friendsList = await redisClient.lrange(
      `friends:${socket.user.username}`,
      0,
      -1
    );
    // get parsed friend list [...,{username:"",userId:"",connected:""},....]
    const parsedFriendList = await parseFriendList(friendsList);
    // get friends room details
    const friendRooms = parsedFriendList.map((friend) => friend.userId);
    if (friendRooms.length > 0) {
      // console.log("Emitting to my friends that I am online")
      socket.to(friendRooms).emit("connected", '1', socket.user.username);
    }

    //-----emit friends list [...,{username:string,userId:ObjectId,connected:boolean},...] -----
    socket.emit("friends", parsedFriendList);

    // send all messages
    const msgQuery = await redisClient.lrange(
      `chat:${socket.user.id}`,
      0,
      -1
    );
    // to.from.format
    const messages = msgQuery.map((msgStr) => {
      const parsedStr = msgStr.split(".");
      return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
    });
    if (messages && messages.length > 0) {
      socket.emit("messages", messages);
    }
  },
  addFriend: async (socket, friendName, cb) => {
    try {
      if (friendName === socket.user.username) {
        return cb({ done: false, errorMsg: "Cannot add self !! ):" });
      }
      const friend = await redisClient.hgetall(`userId:${friendName}`);

      if (!friend) {
        return cb({ done: false, errorMsg: "Invalid username!" });
      }
      // find user's current friend list
      const currentFriendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0,
        -1
      );
      // if friend is already in friend-list
      if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
        return cb({ done: false, errorMsg: "Already in your friend list!" });
      }
      // store friends in list in form of ..,<friendName>.<friendUserId>,...
      await redisClient.lpush(
        `friends:${socket.user.username}`,
        [friendName, friend.userId].join(".")
      );
      const newFriend = {
        username: friendName,
        userId: friend.userId,
        connected: friend.connected,
      };
      cb({ done: true, newFriend });
      return cb({ done: true });
    } catch (error) {
      return cb({ done: false, errorMsg: error.message });
    }
  },
  onDisconnect: async (socket) => {
    console.log("Disconnecting from socket server...")
    // update status in redis
    await redisClient.hset(
      `userId:${socket.user.username}`,
      "connected",
      false
    );
    // get friends
    // emit to all friends that we are offline
    const friendList = await redisClient.lrange(
      `friends:${socket.user.username}`,
      0,
      -1
    );
    const friendRooms = await parseFriendList(friendList).then((friends) =>
      friends.map((friend) => friend.userId)
    );
    socket.to(friendRooms).emit("connected", false, socket.user.username);
  },
  dm: async (socket, message) => {
    message.from = socket.user.id;
    // to.from.content
    const messageString = [message.to, message.from, message.content].join(".");
    await redisClient.lpush(`chat:${message.to}`, messageString);
    await redisClient.lpush(`chat:${message.from}`, messageString);
    socket.to(message.to).emit("dm", message);
  },
};

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    // get friends username from <friendUserName>.<friendUserId> list
    const parsedFriend = friend.split(".");
    // get friends connected status from hash set {username:string,connected:boolean}
    const friendConnected = await redisClient.hget(
      `userId:${parsedFriend[0]}`,
      "connected"
    );
    newFriendList.push({
      username: parsedFriend[0],
      userId: parsedFriend[1],
      connected: friendConnected,
    });
  }
  return newFriendList;
};
