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
    redisClient.hset(
      `userId:${socket.user?.username}`,
      "userId",
      socket.user.userId
    );
    console.log(`userId:${socket.user.username}`, "userId", socket.user.id);
  },
  addFriend: ({friendName,cb})=>{
    console.log(friendName);
    cb({done:true});
  }
};
