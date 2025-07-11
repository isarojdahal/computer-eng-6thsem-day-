import express from "express";
import multer from "multer";
import cors from "cors";

//
const app = express();
app.use(cors("*"));

app.get("/", (req, res) => {
  res.send("API is working");
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[1]);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("photo"), (req, res) => {
  res.json({ message: "File uploaded" });
});

app.listen(4000, () => {
  console.log("Server has started in port 4000");
});
