const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/communityPosts');


// Create a new post
router.post('/', async (req, res) => {
  try {
    const { message, user } = req.body;
    const newPost = new Post({ message, user });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch a specific post by its ID
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Fetch a specific comment or reply by its ID
router.get('/:postId/comments/:commentId', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let foundComment = null;
    
    // Helper function to recursively search for a comment or reply by ID
    const findCommentById = (comments, id) => {
      for (let comment of comments) {
        if (comment._id.toString() === id) {
          return comment;
        }
        const foundInReplies = findCommentById(comment.replies, id);
        if (foundInReplies) {
          return foundInReplies;
        }
      }
      return null;
    };

    foundComment = findCommentById(post.comments, commentId);

    if (!foundComment) {
      return res.status(404).json({ message: 'Comment or reply not found' });
    }

    res.status(200).json(foundComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like a post
router.patch('/:postId/like', async (req, res) => {
  try {
    const { postId } = req.params;
    const { username } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likedBy.includes(username)) {
      post.likedBy.push(username);
      post.likesCount++;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Dislike a post
router.patch('/:postId/dislike', async (req, res) => {
  try {
    const { postId } = req.params;
    const { username } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const index = post.likedBy.indexOf(username);
    if (index !== -1) {
      post.likedBy.splice(index, 1);
      post.likesCount--;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add a top-level comment to a post
router.post('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, author } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      content,
      author,
      date: new Date(),
      replies: []
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to find a comment or reply by ID recursively
const findCommentById = (comments, id) => {
  for (let comment of comments) {
    if (comment._id.toString() === id) {
      return comment;
    }
    const foundInReplies = findCommentById(comment.replies, id);
    if (foundInReplies) {
      return foundInReplies;
    }
  }
  return null;
};

// Recursive function to find the parent comment or reply by ID and add the new reply
const addReplyToComment = (comments, commentId, newReply) => {
  for (let comment of comments) {
    if (comment._id.toString() === commentId) {
      newReply._id = new mongoose.Types.ObjectId(); // Ensure new replies have _id
      comment.replies.push(newReply);
      return true;
    }
    if (comment.replies && comment.replies.length > 0) {
      const found = addReplyToComment(comment.replies, commentId, newReply);
      if (found) return true;
    }
  }
  return false;
};

// Reply to a comment or a reply
router.post('/:postId/comments/:commentId/reply', async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, author } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newReply = {
      content,
      author,
      date: new Date(),
      replies: [],
      _id: new mongoose.Types.ObjectId() // Ensure new replies have _id
    };

    const added = addReplyToComment(post.comments, commentId, newReply);
    if (!added) {
      return res.status(404).json({ message: 'Comment or reply not found' });
    }

    await post.save();
    res.status(201).json(newReply);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
