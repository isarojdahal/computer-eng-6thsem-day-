import express from "express";
import { MongoClient } from "mongodb";

// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

// Database Name
const dbName = "try_db";

try {
  //  DB.
  const c = await client.connect();
  console.log("Connected successfully to server");

  const db = c.db(dbName);
  const collection = db.collection("posts");
  // Server
  const app = express();

  app.get("/alldata", async (req, res) => {
    const allPosts = await collection.find().toArray();
    return res.json(allPosts);
  });

  app.listen(4000);
} catch (e) {}
