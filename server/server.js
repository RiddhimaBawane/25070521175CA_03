const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flexica3";

const Item = mongoose.model("Item", new mongoose.Schema({
  type: String,          // "Lost" ya "Found"
  name: String,
  location: String,
  description: String,
  contact: String,
  returned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.static(path.join(__dirname, "..", "client")));

app.get("/api/items", async (req, res) => {
  res.json(await Item.find().sort({ createdAt: -1 }));
});

app.post("/api/items", async (req, res) => {
  const { type, name, location, description, contact } = req.body;
  res.json(await Item.create({ type, name, location, description, contact }));
});

app.put("/api/items/:id", async (req, res) => {
  res.json(await Item.findByIdAndUpdate(req.params.id, { returned: req.body.returned }, { new: true }));
});

app.delete("/api/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log("MongoDB connected:", MONGO_URI);
  } catch (err) {
    console.log("Local MongoDB not found, launching in-memory database fallback...");
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log("MongoDB connected (in-memory)");
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
