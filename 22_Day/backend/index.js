// require("dotenv").config();
import "dotenv/config";
import bcrypt from "bcrypt";
import express from "express";
import * as z from "zod";
import { MongoClient } from "mongodb";
import cors from "cors";

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

    function validateRegister(req, res, next) {
      const registerSchema = z.object({
        name: z
          .string()
          .min(3, "Name should be at least of 3 letters")
          .max(50, "Maximum name length is 50"),
        email: z.email(),
        password: z
          .string()
          .min(5, "Password should be at least of 5 letters."),
      });
      console.log("req.body", req.body);

      try {
        registerSchema.parse({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        next();
      } catch (err) {
        console.log("err", err);
        res.status(400).json({
          message: "Invalid data. Error during registration.",
          error: err.errors,
        });
      }
    }

    function validateLogin(req, res, next) {
      const loginSchema = z.object({
        email: z.email(),
        password: z
          .string()
          .min(5, "Password should be at least of 5 letters."),
      });
      console.log("req.body", req.body);

      try {
        loginSchema.parse({
          email: req.body.email,
          password: req.body.password,
        });
        next();
      } catch (err) {
        console.log("err", err);
        res.status(400).json({
          message: "Invalid data. Error during Login.",
          error: err.errors,
        });
      }
    }

    app.post("/login", validateLogin, async (req, res) => {
      const body = req.body;
      try {
        const found = await collection.findOne({ email: req.body.email });

        if (!found) {
          return res.status(401).json({
            message: "Invalid Credentials",
          });
        }

        if (bcrypt.compareSync(req.body.password, found.password)) {
          return res.json({ message: "Login successful" });
        } else {
          return res.status(500).json({ message: "Invalid Credentials." });
        }
      } catch (err) {
        res.status(500).json({ message: "Database error", error: err.message });
      }
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
