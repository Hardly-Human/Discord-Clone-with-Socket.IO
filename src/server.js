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
	console.log("Connected to Browser ✅");
	socket.on("enter_name", (roomName) => {
		socket.join(roomName);
	});
});

httpServer.listen(3000, () => console.log("Listening on PORT : 3000"));
