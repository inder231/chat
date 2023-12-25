const Redis = require("ioredis");
const redisConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

let redisClient = null;

const createRedisConnection = () => {
  redisClient = new Redis(redisConfig);
  redisClient.on("connect", () => {
    console.log("Connected to Redis");
  });
  redisClient.on("error", (error) => {
    console.error("Redis conection error:", error);
  });
};
if (!redisClient) {
  createRedisConnection();
}

module.exports = redisClient;