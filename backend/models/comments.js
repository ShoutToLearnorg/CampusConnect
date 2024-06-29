// models/Post.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: String,
  user: String,
  replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }],
});

const postSchema = new Schema({
  title: String,
  content: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [commentSchema],
});

module.exports = mongoose.model('BlogPost', postSchema);
