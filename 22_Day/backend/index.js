// require("dotenv").config();
import "dotenv/config";
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
    const collection = db.collection("quotes");
    // Server
    const app = express();
    app.use(cors("*"));
    app.use(express.json());

    function validate(req, res, next) {
      const quoteSchema = z.object({
        author: z.string().min(3).max(50),
        quote: z.string().min(3),
      });
      try {
        quoteSchema.parse({ author: req.body.author, quote: req.body.quote });
        next();
      } catch (err) {
        res.status(400).json({
          message: "Invalid data. (Unable to add new quote)",
          error: err.errors,
        });
      }
    }

    app.post("/quote", validate, async (req, res) => {
      const body = req.body;
      try {
        const inserted = await collection.insertOne({
          author: body.author,
          quote: body.quote,
        });
        if (inserted.acknowledged) {
          return res.json({ message: "Added new quote" });
        } else {
          return res.status(500).json({ message: "Failed to add quote" });
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
