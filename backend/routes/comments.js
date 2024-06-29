// routes/posts.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/comments');

router.post('/', async (req, res) => {
  console.log('Received create post request:', req.body); // Add this line
  const post = new BlogPost({
    title: req.body.title || '',
    content: req.body.content || req.body.text,
    user: req.body.user,
    comments: [],
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err); // Add this line
    res.status(400).json({ message: err.message });
  }
});


// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific post
router.get('/:id', getPost, (req, res) => {
  res.json(res.post);
});



// POST add a comment to a post
router.post('/:id/comments', getPost, async (req, res) => {
  const comment = {
    text: req.body.text,
    user: req.body.user,
    replies: [],
  };
  res.post.comments.push(comment);

  try {
    const updatedPost = await res.post.save();
    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST add a reply to a comment
router.post('/:postId/comments/:commentId/replies', getPost, async (req, res) => {
  const reply = {
    text: req.body.text,
    user: req.body.user,
  };

  const comment = res.post.comments.id(req.params.commentId);
  comment.replies.push(reply);

  try {
    const updatedPost = await res.post.save();
    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware function to get a single post by ID
async function getPost(req, res, next) {
  let post;
  try {
    post = await BlogPost.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.post = post;
  next();
}

module.exports = router;
