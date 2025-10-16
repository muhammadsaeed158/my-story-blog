const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post"); // <-- model import

const app = express();
app.use(express.json()); // JSON body parse karne ke liye

// MongoDB Connection
mongoose.connect("your-mongodb-uri-here", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Connection error:", err));


// 📌 1. Add New Post
app.post("/posts", async (req, res) => {
  try {
    const newPost = new Post(req.body); // title, content, author
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 2. Get All Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 3. Home Route
app.get("/", (req, res) => {
  res.send("🚀 Blog API is running...");
});

// Start Server
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});