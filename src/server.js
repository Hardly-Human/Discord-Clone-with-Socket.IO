const path = require("path");
const http = require("http");
const express = require("express");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
	res.render("home");
});

const httpServer = http.createServer(app);

httpServer.listen(3000, () => console.log("Listening on PORT : 3000"));
