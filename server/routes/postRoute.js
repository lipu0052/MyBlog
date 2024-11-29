const express = require('express');
const router = express.Router();
const Post = require('../Schema/postSchema');
const authenticateUser = require('../authenticate');






router.post('/post', authenticateUser, async (req, res) => {
    if (!req.rootUser.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  
    const { title, content, image , category } = req.body;
  
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }
  
    const slug = title.split(' ').join('_').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '_');
  
    const newPost = new Post({
     
      slug,
      content,
      category,
      author: req.rootUser._id,
      image: image || 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.webp'
    });
  
    try {
      const savedPost = await newPost.save();
      res.status(201).json({ message: 'Post created successfully', savedPost });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  router.get('/posts', authenticateUser, async (req, res) => {
    const { postId } = req.query; // Get postId from query parameters
    try {
        let posts;
        if (postId) {
            // Fetch a single post by its ID
            posts = await Post.find({ _id: postId });
        } else {
            // Fetch all posts if no postId is provided
            posts = await Post.find();
        }
        res.status(200).json({ message: 'Posts fetched successfully', posts });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });
  router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params; // Extract postId from URL parameters
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post fetched successfully', post });
    } catch (err) {
      console.error('Error fetching post:', err.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  
  
  
  
  router.delete('/deletePost/:postId', authenticateUser, async (req, res) => {
    try {
      const rootUserId = req.rootUser._id.toString();
      const post = await Post.findOne({ _id: req.params.postId });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (post.author.toString() !== rootUserId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const deletedPost = await Post.findOneAndDelete({ _id: req.params.postId });
      res.status(200).json({ message: 'Post deleted successfully', deletedPost });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  // Assuming you have express and necessary imports
  router.put('/editPost/:postId', authenticateUser, async (req, res) => {
    try {
      const { postId } = req.params;
      const { slug, content, category, image } = req.body;
  
      // Find the post by ID
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Check if the logged-in user is the author of the post
      if (post.author.toString() !== req.rootUser._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Update fields if provided
      post.slug = slug || post.slug;
      post.content = content || post.content;
      post.category = category || post.category;
      post.image = image || post.image;
  
      // Save the updated post
      const updatedPost = await post.save();
  
      res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  module.exports = router
  