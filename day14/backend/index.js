const express = require("express");
const fs = require("node:fs");
const cors = require("cors");
const filePath = __dirname + "/data.json";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("API is working");
});

// Get all the quotes
app.get("/quote", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
    res.status(200).json(data.trim());
  });
});

// Get one quote
app.get("/quote/:id", (req, res) => {
  const id = req.params.id;

  if (!id) res.send("No id was provided");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const d = JSON.parse(data);
    const obtainedData = d.filter((value) => value.id == id);
    res.status(200).json(obtainedData);
  });
});

//Add new quote
app.post("/quote", (req, res) => {
  console.log("req.body", req.body);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const d = JSON.parse(data);
    const newData = [...d, req.body];

    return fs.writeFile("./data.json", JSON.stringify(newData), (err) => {
      if (err) {
        console.error(err);
      } else {
        return res.status(200).json({ message: "New quote added" });
      }
    });
  });
});

//Delete Quote
app.delete("/quote", (req, res) => {});

app.listen(4000, () => {
  console.log("Server is running");
});
