const socket = io();

const nameForm = document.querySelector("#nameForm");
const welcome = document.querySelector("#welcome");
const roomForm = document.querySelector("#roomForm");
const room = document.querySelector("#room");
const messageForm = document.querySelector("#messageForm");

let roomName = "";
room.hidden = true;

function makeMessage(msg) {
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = msg;
	ul.appendChild(li);
}

function handleMessageSubmit(event) {
	event.preventDefault();
	const input = messageForm.querySelector("input");
	const value = input.value;
	socket.emit("new_message", value, roomName, () => {
		makeMessage(`You: ${value}`);
	});
	input.value = "";
}

function showRoom() {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName}`;
	messageForm.addEventListener("submit", handleMessageSubmit);
}

roomForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const input = roomForm.querySelector("input");
	const value = input.value;
	socket.emit("enter_room", value, showRoom);
	roomName = value;
	input.value = "";
});

nameForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const input = nameForm.querySelector("input");
	socket.emit("nickname", input.value);
});

socket.on("welcome", (name) => {
	makeMessage(`${name} Joined!`);
});

socket.on("bye", (name) => {
	makeMessage(`${name} Left!`);
});

socket.on("new_message", (msg) => {
	makeMessage(msg);
});

socket.on("room_change", (rooms) => {
	const roomList = welcome.querySelector("ul");
	if (rooms.length === 0) {
		roomList.innerHTML = "";
		return;
	}
	rooms.forEach((room) => {
		const li = document.createElement("li");
		li.innerText = room;
		roomList.append(li);
	});
});
