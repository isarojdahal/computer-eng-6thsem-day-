const http = require("node:http");

http
  .createServer(function (req, res) {
    console.log("Req object", req);

    if (req.url.startsWith("/login?")) {
      const queryData = req.url.split("?")[1].split("&");
      const email = queryData[0].split("=")[1];
      const password = queryData[1].split("=")[1];

      // db...
      // select * from users where email=${email} and password={password.}
      //res.end({login success})
      // res.end(error)
      res.setHeader("content-type", "application/json");

      if (email == "abc@gmail.com" && password == "abc")
        res.end(
          JSON.stringify({
            message: "Login success",
          })
        );
      else {
        res.end(
          JSON.stringify({
            message: "Login failed",
          })
        );
      }
    } else if (req.url == "/auth/login") {
      req.on("data", (data) => {
        console.log("data", data);
      });

      // db...
      // select * from users where email=${email} and password={password.}
      //res.end({login success})
      // res.end(error)
      res.setHeader("content-type", "application/json");

      if (email == "abc@gmail.com" && password == "abc")
        res.end(
          JSON.stringify({
            message: "Login success",
          })
        );
      else {
        res.end(
          JSON.stringify({
            message: "Login failed",
          })
        );
      }
    } else res.end("Server is working");
  })
  .listen(4000);

console.log("server has started.");
