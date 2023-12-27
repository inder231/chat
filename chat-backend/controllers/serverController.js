const redisClient = require("../config/redis");
const RedisStore = require("connect-redis").default; // pass session here..
const session = require("express-session");
require("dotenv").config();

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    // it allow cookies to be set when we both are no same domain, but in production we need to be none and in development to be lax
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 1, // cookie expired after 1hour
  },
});

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

const corsConfig = {
    origin: "http://localhost:5173",
    credentials: true,
  }
module.exports = { sessionMiddleware,wrap,corsConfig };
