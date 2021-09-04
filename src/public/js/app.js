const socket = io();

const roomForm = document.querySelector("#roomForm");

roomForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const input = roomForm.querySelector("input");
	const value = input.value;
	socket.emit("enter_name", value);
	input.value = "";
});
