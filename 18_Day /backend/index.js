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

  app.get("/quotes", async (req, res) => {
    const allQuotes = await collection.find().toArray();
    return res.json(allQuotes);
  });

  app.get("/quote/:id", async (req, res) => {
    const id = req.params.id;
    const foundQuote = await collection.findOne({
      _id: new ObjectId(id),
    });
    return res.json(foundQuote);
  });

  app.post("/quote", async (req, res) => {
    const body = req.body;

    const inserted = await collection.insertOne({
      author: body.author,
      quote: body.quote,
    });
    if (inserted) return res.json({ message: "Added new quote" });
  });

  app.put("/quote/:id", async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const foundQuote = await collection.findOne({
      _id: new ObjectId(id),
    });

    if (!foundQuote) return res.json({ message: "Updating quote not found" });

    const updated = await collection.updateOne(
      {
        _id: new ObjectId(id),
      },
      [
        {
          $set: {
            author: body.author,
            quote: body.quote,
          },
        },
      ]
    );

    if (updated) return res.json({ message: "Quote updated" });
  });

  app.delete("/quote/:id", async (req, res) => {
    const quoteFound = await collection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!quoteFound)
      return res.json({ message: " Deleting Quote ID not found" });

    // found
    const deleted = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (deleted) return res.json({ message: " Quote deleted" });
  });
  app.listen(4000);
} catch (e) {}
