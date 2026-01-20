const express = require('express')
const { createComment, deleteComment, updateComment } = require('../../controllers/comments/commentsController')
const isLoggedIn = require('../../middlewares/isLoggedIn')

const commentsRouter = express.Router();

//! Create Comment Route
commentsRouter.post('/:postId', isLoggedIn, createComment)
commentsRouter.delete('/:commentId', isLoggedIn, deleteComment)
commentsRouter.put('/:commentId', isLoggedIn, updateComment)

module.exports = commentsRouter
