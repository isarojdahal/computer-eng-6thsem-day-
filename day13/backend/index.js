const express = require("express");
const cors = require("cors");

const server = express();

server.use(express.json());

server.use(
  cors({
    origin: ["http://127.0.0.1:5600", "http://127.0.0.1:5500"],
  })
);

server.get("/user/greet", (req, res) => {
  res.send("Hello " + req.query.name + ". How is " + req.query.location + "?");
});

server.post("/user/greet", (req, res) => {
  res.send("Hello " + req.body.name + ". How is " + req.body.location + "?");
});

server.listen(4000);
