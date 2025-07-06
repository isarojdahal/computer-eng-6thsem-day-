const http = require("node:http");

http
  .createServer(function (req, res) {
    if (req.url.startsWith("/user/greet")) {
      const name = req.url.split("=")[1];

      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          message: "Hello " + name,
        })
      );
    }
  })
  .listen(4000);

console.log("server is running");
