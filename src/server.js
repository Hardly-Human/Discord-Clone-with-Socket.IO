const path = require("path");
const http = require("http");
const express = require("express");
const SocketIO = require("socket.io");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
	res.render("home");
});

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
	socket.onAny((event) => {
		console.log(`Socket Event : ${event}`);
	});

	socket.on("enter_name", (roomName, done) => {
		socket.join(roomName);
		done();
		socket.to(roomName).emit("welcome");
	});
});

httpServer.listen(3000, () => console.log("Listening on PORT : 3000"));
