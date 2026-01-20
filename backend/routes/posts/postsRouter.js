const express = require('express')
const { createPost, getAllPosts, getPost, deletePost, updatePost, likePost, dislikePost, clapPost, schedulePost } = require('../../controllers/posts/postsController')
const isLoggedIn = require('../../middlewares/isLoggedIn');
const isAccountVerified = require('../../middlewares/isAccountVerified');
const multer = require('multer');
const storage = require('../../utils/fileUpload')
const postsRouter = express.Router();
const upload = multer({ storage });

//! Create Post Route
postsRouter.post('/', isLoggedIn, upload.single('file'), createPost)
//! GET all posts Route
postsRouter.get('/', isLoggedIn, getAllPosts)
//! Get a single post route
postsRouter.get('/:id', getPost)
//! Delete Post Route
postsRouter.delete('/:id', isLoggedIn, deletePost)
//! Update Post Route
postsRouter.put('/:id', isLoggedIn, updatePost)
//! Like Post Route
postsRouter.put('/like/:postId', isLoggedIn, likePost)
//! Dislike Post Route
postsRouter.put('/dislike/:postId', isLoggedIn, dislikePost)
//! Clap Post Route
postsRouter.put('/clap/:postId', isLoggedIn, clapPost)
//! SCHEDULED PUBLISHING OF POST ROUTE
postsRouter.put('/schedule/:postId', isLoggedIn, schedulePost)


module.exports = postsRouter
