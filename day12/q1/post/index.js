const http = require("node:http");

http
  .createServer(function (req, res) {
    if (req.url == "/user/greet" && req.method == "POST") {
      req.on("data", (chunk) => {
        const data = JSON.parse(chunk.toString());
        res.end(
          JSON.stringify({
            message: "Hello " + data.name,
          })
        );
      });
    }
  })
  .listen(4000);
