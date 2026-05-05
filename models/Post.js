const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: String,
  avatar: String,
  content: String,
  images: [String],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);