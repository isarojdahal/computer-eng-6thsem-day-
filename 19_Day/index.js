import express from "express";

const app = express();

function checkSomething(req, res, next) {
  console.log("Checking something.");

  if (true) next();
  else res.send("milena");
}

app.get("/", checkSomething, (req, res) => {
  res.send("Hello World");
});

app.listen(3000);
