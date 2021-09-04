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

function PublicRooms() {
	const sids = wsServer.sockets.adapter.sids;
	const rooms = wsServer.sockets.adapter.rooms;

	const publicRooms = [];
	rooms.forEach((_, key) => {
		if (sids.get(key) === undefined) {
			publicRooms.push(key);
		}
	});

	return publicRooms;
}

wsServer.on("connection", (socket) => {
	socket["nickname"] = "Anonymous";
	socket.onAny((event) => {
		console.log(`Socket Event : ${event}`);
	});

	socket.on("enter_room", (roomName, done) => {
		socket.join(roomName);
		done();
		socket.to(roomName).emit("welcome", socket.nickname);
		wsServer.sockets.emit("room_change", PublicRooms());
	});

	socket.on("disconnecting", () => {
		socket.rooms.forEach((room) =>
			socket.to(room).emit("bye", socket.nickname)
		);
	});

	socket.on("disconnect", () => {
		wsServer.sockets.emit("room_change", PublicRooms());
	});

	socket.on("new_message", (msg, roomName, done) => {
		socket.to(roomName).emit("new_message", `${socket.nickname} : ${msg}`);
		done();
	});

	socket.on("nickname", (name) => {
		socket["nickname"] = name;
	});
});

httpServer.listen(3000, () => console.log("Listening on PORT : 3000"));
