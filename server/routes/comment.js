
const express = require('express');
const router = express.Router();
const Comment = require('../Schema/commentScheme');
const Subscriber = require('../Schema/SubscriberSchema');
const Post = require('../Schema/postSchema');
const User = require('../Schema/userSchema');

const { body, validationResult } = require('express-validator');
const authenticateUser = require('../authenticate');


router.get('/comments', authenticateUser, async (req, res) => {
    const { postId } = req.query;
  
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }
  
    try {
      const comments = await Comment.find({ post: postId }).populate('author', 'name profileImg');
      res.status(200).json({ message: 'Comments fetched successfully', comments });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
    }
  });
  
  // Route to create a new comment
  router.post('/comments', authenticateUser, async (req, res) => {
    const { postId, content } = req.body;
  
    if (!postId || !content) {
      return res.status(400).json({ message: 'Post ID and content are required' });
    }
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const newComment = new Comment({
        content,
        post: postId,
        author: req.rootUser._id,
      });
  
      const savedComment = await newComment.save();
  
      res.status(201).json({
        message: 'Comment posted successfully',
        comment: await savedComment.populate('author', 'name profileImg'),
      });
    } catch (err) {
      res.status(500).json({ message: 'Failed to post comment', error: err.message });
    }
  });
  
  // Route to handle subscription requests
  router.post('/subscribe', [
    body('email').isEmail().withMessage('Please provide a valid email address'), // Validate email
  ], async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
  
    const { email } = req.body;
  
    try {
      // Check if the email is already subscribed
      const existingSubscriber = await Subscriber.findOne({ email });
      if (existingSubscriber) {
        return res.status(400).json({ message: 'You are already subscribed' });
      }
  
      // Create a new subscriber in the database
      const newSubscriber = new Subscriber({ email });
      await newSubscriber.save();
  
      // Send success response
      res.status(200).json({ message: 'You have successfully subscribed!' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error subscribing. Please try again later.' });
    }
  });
  

  module.exports = router;