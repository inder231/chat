const express = require("express");
const { Server } = require("socket.io");
const helmet = require("helmet");
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
const authRouter = require("./routes/auth.routes");
const { connection } = require("./config/db");
const {
  sessionMiddleware,
  wrap,
  corsConfig,
} = require("./controllers/serverController");
const {
  authorizeUser,
  initializeUser,
  addFriend,
  onDisconnect,
  dm,
} = require("./controllers/socketController");

const app = express();

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: corsConfig,
});

app.use(morgan("dev"));
app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);
app.use("/auth", authRouter);
app.set("trust proxy", 1);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);

  socket.on("add_friend", (friendName, cb) => {
    addFriend(socket, friendName, cb);
  });

  socket.on("dm", (message) => dm(socket, message));

  socket.on("disconnecting", () => onDisconnect(socket));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("NODE_ENV") === "development" ? err : {};

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

server.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${process.env.PORT || 4000}`);
});
