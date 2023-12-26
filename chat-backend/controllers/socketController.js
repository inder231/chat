const createError = require("http-errors");
const redisClient = require("../config/redis");

module.exports = {
  authorizeUser: (socket, next) => {
    if (!socket.request.session || !socket.request?.session?.user) {
      console.log("Bad request");
      return next(createError(401, "Not authorized!"));
    }
    next();
  },
  initializeUser: (socket) => {
    // store user in socket
    socket.user = { ...socket.request?.session?.user };
    // store user user name <--> userId in redis( hset ) so that if someone make a request to add friend we can access that easily.
    console.log(socket.user);
    redisClient.hset(
      `userId:${socket.user?.username}`,
      "userId",
      socket.user.id
    );
    console.log(`userId:${socket.user.username}`, "userId", socket.user.id);
  },
  addFriend: async (socket, friendName, cb) => {
    try {
      if (friendName === socket.user.username) {
        return cb({ done: false, errorMsg: "Cannot add self !! ):" });
      }
      const friendUserID = await redisClient.hget(
        `userId:${friendName}`,
        "userId"
      );
      if (!friendUserID) {
        return cb({ done: false, errorMsg: "Invalid username!" });
      }
      return cb({ done: true });
    } catch (error) {
      return cb({ done: false, errorMsg: error.message });
    }
  },
};
