const redisClient = require("../config/redis");

module.exports = {
  //   rateLimiter: async (req, res, next) => {
  //     const ip = req.connection.remoteAddress;
  //     // multi: help in making multiple query at once, incr : increase the number of count of key(ip) and expire set to 60sec and exec: to execute them all
  //     const [response] = await redisClient.multi().incr(ip).expire(ip, 60).exec();
  //     // console.log(response[1]); // [null,<count>]
  //     if (response[1] > 10) {
  //         return res.json({loggedIn:false,message:"Slow down!!! Try again in a minute."})
  //     } else {
  //       next();
  //     }
  //   },
  // ---------- refactor to take dynamic pamaters -- like expire time(seconds) and limit ------------

  rateLimiter: (expireTime, limitCount) => {
    return async (req, res, next) => {
      const ip = req.connection.remoteAddress;
      const [response] = await redisClient
        .multi()
        .incr(ip)
        .expire(ip, expireTime)
        .exec();
      if (response[1] > limitCount) {
        return res.json({
          loggedIn: false,
          message: "Slow down!!! Try again in a minute.",
        });
      } else {
        next();
      }
    };
  },
};
