// require("dotenv").config();
import "dotenv/config";
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

// Connection URL
const client = new MongoClient(process.env.DB_URL);

try {
  //  DB.
  const c = await client.connect();
  console.log("Connected successfully to server");

  const db = c.db(process.env.DB_NAME);
  const collection = db.collection("quotes");
  // Server
  const app = express();
  app.use(cors("*"));
  app.use(express.json());
  app.post("/quote", async (req, res) => {
    const body = req.body;

    const inserted = await collection.insertOne({
      author: body.author,
      quote: body.quote,
    });
    if (inserted) return res.json({ message: "Added new quote" });
  });

  app.listen(4000);
} catch (e) {}
