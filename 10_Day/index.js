const http = require("node:http");

console.log("http", http);

const server = http.createServer(function (req, res) {
  console.log("inside function");
  console.log("req", req);
  console.log("url", req.url);
  console.log("method", req.method);
});

server.listen(4000);
console.log("server is running hai");
