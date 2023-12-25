const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
const session = require("express-session");
require("dotenv").config();
const authRouter = require("./routes/auth.routes");
const { connection } = require("./config/db");
const redisClient = require("./config/redis");
const RedisStore = require("connect-redis").default; // pass session here..

const app = express();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENV === "production",
      httpOnly: true,
      // it allow cookies to be set when we both are no same domain, but in production we need to be none and in development to be lax
      sameSite: process.env.ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 5, // cookie expired after 5min
    },
  })
);

app.use("/auth", authRouter);

io.on("connect", (socket) => {});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error!" });
});

(() => {
  connection
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => console.log(`Error connecting to db: ${err.message}`));
})();

server.listen(4000, () => {
  console.log(`Listening on port 4000`);
});
