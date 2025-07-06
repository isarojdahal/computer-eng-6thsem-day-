const http = require("node:http");

http
  .createServer(function (req, res) {
    if (req.url == "/calculate") {
      req.on("data", (chunk) => {
        const data = JSON.parse(chunk.toString());

        const num1 = parseInt(data.num1);
        const num2 = parseInt(data.num2);

        res.setHeader("content-type", "text/plain");

        res.end("sum is " + (num1 + num2));
        //   res.end({
        //       result:""
        //   })
      });
    }
  })
  .listen(4000);

console.log("server is running");
