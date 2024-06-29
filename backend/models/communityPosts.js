const mongoose = require('mongoose');
const { Schema } = mongoose;

// Nested reply schema
const nestedReplySchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [this], // Recursive schema definition for further nesting
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
});

// Reply schema
const replySchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [nestedReplySchema],
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
});

// Comment schema
const commentSchema = new Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [replySchema],
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
});

// Post schema
const postSchema = new Schema({
  message: { type: String, required: true },
  user: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  likedBy: [String], // Array of usernames who liked the post
  date: { type: Date, default: Date.now },
  comments: [commentSchema],
  __v: { type: Number, select: false } // Hide __v field
}, { _id: true }); // Enable _id field

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
