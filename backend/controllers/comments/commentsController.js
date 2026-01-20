const asyncHandler = require('express-async-handler')
const Post = require('../../models/posts/Post')
const Comment = require('../../models/comments/Comment')

//@DESC CREATE A NEW COMMENT
//@ROUTE POST /api/v1/comments/:postId
//@ACCESS PRIVATE
exports.createComment = asyncHandler(
    async (req, resp) => {
        // GET THE PAYLOAD
        const { message } = req.body;
        // GET THE POST ID
        const postId = req.params.postId;
        // CREATE THE COMMENT
        const comment = await Comment.create({
            message,
            author: req?.userAuth?._id,
            postId
        })
        // Associate comment with Post
        await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: comment._id
                }
            },
            {
                new: true
            }
        )
        resp.status(201).json({
            status: 'success',
            message: 'Comment successfully created',
            comment
        })
    }
)

//@DESC DELETE COMMENT
//@ROUTE DELETE /api/v1/comments/:commentId
//@ACCESS PRIVATE
exports.deleteComment = asyncHandler(
    async (req, resp) => {
        //! GET THE COMMENT ID TO BE DELETED
        const commentId = req.params.commentId;
        await Comment.findByIdAndDelete(commentId);
        resp.status(201).json({
            status: 'success',
            message: 'Comment successfully deleted!'
        })
    }
)

//@DESC UPDATE COMMENT
//@ROUTE PUT /api/v1/comments/:commentId
//@ACCESS PRIVATE
exports.updateComment = asyncHandler(
    async (req, resp) => {
        //! GET THE COMMENT ID TO BE DELETED
        const commentId = req.params.commentId;
        //! GET THE MESSAGE
        const message = req.body.message;
        const updatedComment = await Comment.findByIdAndUpdate(commentId,
            {
                message
            },
            {
                new: true,
                runValidators: true
            }
        );
        resp.status(201).json({
            status: 'success',
            message: 'Comment successfully updated!',
            updatedComment
        })
    }
)