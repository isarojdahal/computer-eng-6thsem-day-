const http = require("node:http");

const server = http.createServer(function (req, res) {
  // res.end("Hello world")
  //   res.end("<h1>Hello world</h1>");
  //   res.end(
  //     JSON.stringify({
  //       name: "username",
  //       salary: 50000,
  //     })
  //   );

  res.end(
    JSON.stringify([
      {
        name: "username",
        salary: 50000,
      },
      {
        name: "username2",
        salary: 300000,
      },
    ])
  );
});

server.listen(4000);

console.log("server is running hai");
