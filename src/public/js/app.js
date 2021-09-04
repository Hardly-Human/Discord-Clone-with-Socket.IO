const socket = io();

const welcome = document.querySelector("#welcome");
const roomForm = document.querySelector("#roomForm");
const room = document.querySelector("#room");
const messageForm = document.querySelector("#messageForm");

let roomName = "";
room.hidden = true;

function showRoom() {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName}`;
}

function makeMessage(msg) {
	const ul = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = msg;
	ul.appendChild(li);
}

roomForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const input = roomForm.querySelector("input");
	const value = input.value;
	socket.emit("enter_name", value, showRoom);
	roomName = value;
	input.value = "";
});

messageForm.addEventListener("submit", (event) => {
	event.preventDefault();
});

socket.on("welcome", () => {
	makeMessage("Someone Joined!");
});
