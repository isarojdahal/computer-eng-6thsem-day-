// require("dotenv").config();
import "dotenv/config";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import cors from "cors";
import { validateRegister } from "./middlewares/registerMiddleware.js";
import validateLogin, { add, subtract } from "./middlewares/loginMiddleware.js";
import validateToken from "./middlewares/validateTokenMiddleware.js";

// Connection URL
const client = new MongoClient(process.env.DB_URL);

async function main() {
  try {
    // Connect to DB
    const c = await client.connect();
    console.log("Connected successfully to database.");

    const db = c.db(process.env.DB_NAME);
    const collection = db.collection("user");
    // Server
    const app = express();
    app.use(cors("*"));
    app.use(express.json());

    app.post("/login", validateLogin, async (req, res) => {
      const body = req.body;
      console.log("body", req.body);
      try {
        const found = await collection.findOne({ email: req.body.email });

        if (!found) {
          return res.status(401).json({
            message: "Invalid Credentials",
          });
        }

        console.log("found", found);
        if (bcrypt.compareSync(req.body.password, found.password)) {
          console.log("req.body.email", req.body.email);
          const token = jwt.sign(
            { email: req.body.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          return res.json({ message: "Login successful", token });
        } else {
          return res.status(500).json({ message: "Invalid Credentials." });
        }
      } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
      }
    });

    app.get("/user/profile", validateToken, async (req, res) => {
      const profile = await collection.findOne({
        email: req.user.email,
      });

      return res.json({
        ...profile,
      });
    });

    app.post("/register", validateRegister, async (req, res) => {
      const body = req.body;
      try {
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(req.body.password, salt);

        const found = await collection.findOne({ email: req.body.email });
        console.log("found", found);
        if (found) {
          return res.status(400).json({
            message: "Email already exists.",
          });
        }

        const inserted = await collection.insertOne({
          email: body.email,
          name: body.name,
          password: passwordHash,
        });
        if (inserted.acknowledged) {
          return res.json({ message: "Created new User." });
        } else {
          return res.status(500).json({ message: "Failed to register user." });
        }
      } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
      }
    });

    app.listen(4000, () => {
      console.log("Server running on http://localhost:4000");
    });
  } catch (e) {
    console.error("Failed to connect to database or start server:", e);
    process.exit(1);
  }
}

main();
