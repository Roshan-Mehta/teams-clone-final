const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const mongoose = require("mongoose");
const authRoutes = require("./routes/AuthRoutes");
const roomRoutes= require("./routes/roomRoutes");
const {checkUser, requireAuth} = require("./middleware/authMiddleware");


// Peer

const { ExpressPeerServer } = require("peer");
const cookieParser = require("cookie-parser");
const { Template } = require("ejs");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});


//Middlewares
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/peerjs", peerServer);
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);



//DATABASE Connection 
const dbURI =
  "mongodb+srv://roshan:roshankumar@123@cluster0.oahpw.mongodb.net/teams-clone-db";
  const PORT = process.env.PORT || 8887;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => server.listen(PORT,  () => console.log(`Server is running on port ${PORT}`)))
  .catch((err) => console.log(err));



//Socket Login
io.on("connection", (socket) => {
  console.log("connected");
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log("roomId: ", roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  });
});


//Routes
app.get("/joinNewRoom", requireAuth, (req, res) => {
  res.redirect(`/join/${uuidv4()}`);
});
app.get("/join/:room", requireAuth, (req, res) => {
  res.render("room", { roomId: req.params.room });
});

app.use(roomRoutes);
app.use(authRoutes);


