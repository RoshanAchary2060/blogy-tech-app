const asyncHandler = require('express-async-handler')
const Post = require('../../models/posts/Post')
const User = require('../../models/users/User')
const Category = require('../../models/categories/Category')

//@desc Create a new post
//@route Post /api/v1/posts
//@access private
exports.createPost = asyncHandler(
    async (req, resp, next) => {
        // GET THE PAYLOAD
        const { title, content, categoryId } = req.body;
        // CHECK IF THE POST IS PRESENT
        const postFound = await Post.findOne({ title })
        if (postFound) {
            let error = new Error('Post already existing')
            next(error)
            return
        }
        //! CREATE POST OBJECT
        console.log('File path:', req?.file); // Debugging line to check file path
        const post = await Post.create({
            title, content,
            category: categoryId,
            author: req?.userAuth?._id,
            image: req?.file?.secure_url
        })
        // UPDATE USER BY ADDING POST IN IT
        const user = await User.findByIdAndUpdate(req?.userAuth?.id,
            { $push: { posts: post._id } }, { new: true })
        // UPDATE CATEGORY BY ADDING POST IN IT
        const category = await Category.findByIdAndUpdate(categoryId,
            { $push: { posts: post._id } },
            { new: true }
        )
        // SEND THE RESPONSE
        resp.json({
            status: 'success'
            , message: 'Post successfully created',
            post, user, category
        })
    }
);

//@DESC GET ALL POSTS
//@ROUTE GET /api/v1/posts
//@ACCESS PRIVATE
exports.getAllPosts = asyncHandler(async (req, resp) => {
    //! GET THE CURRENT USER ID
    const currentUserId = req?.userAuth?._id;
    //! GET THE CURRENT TIME
    const currentTime = new Date();
    //! FETCH ALL USER WHO HAVE BLOCKED THE CURRENT USER
    const usersBlockingCurrentUser = await User.find({ blockedUser: currentUserId })
    //! EXTRACT ONLY IDS OF THESE BLOCKING USERS
    const blockingUsersIds = usersBlockingCurrentUser.map((userObj) => userObj._id)
    //! ADD IDS OF USERS WHOM THE CURRENT USER HAS BLOCKED
    const currentUser = await User.findById(currentUserId);
    blockingUsersIds.push(...currentUser.blockedUser);
    //! FETCH THOSE POSTS WHOSE AUTHOR IS NOT IN THE blockingUsersIds ARRAY AND SCHEDULED DATE IS LESS THAN OR EQUAL TO CURRENT DATE OR NULL
    const query = {
        author: { $nin: blockingUsersIds },
        $or: [
            { scheduledPublished: { $lte: currentTime } },
            { scheduledPublished: null }
        ]
    }
    const allPosts = await Post.find(query).populate({
        path: 'author',
        model: 'User',
        select: 'username email role'
    });
    //! SEND THE RESPONSE
    resp.json({
        status: 'success',
        message: 'All posts successfully fetched',
        allPosts
    })
})

//@DESC GET SINGLE POST
//@ROUTE GET /api/v1/posts/:ID
//@ACCESS PUBLIC
exports.getPost = asyncHandler(async (req, resp) => {
    // GET THE ID
    const postId = req.params.id;
    // FETCH THE POST CORRESPONDING TO THIS ID
    const post = await Post.findById(postId)
    if (post) {
        resp.json({
            status: 'success',
            message: 'Post successfully fetched',
            post
        })
    } else {
        resp.json({
            status: 'success',
            message: 'No post available for given id'
        })
    }
})


//@DESC DELETE POST
//@ROUTE DELETE /api/v1/posts/:id
//@ACCESS PRIVATE
exports.deletePost = asyncHandler(async (req, resp) => {
    // GET THE ID
    const postId = req.params.id;
    // DELETE POST FROM THE DB
    await Post.findByIdAndDelete(postId);
    // SEND THE RESPONSE
    resp.json({
        status: 'success',
        message: 'Post successfully deleted',
    })
})

//@DESC UPDATE POST
//@ROUTE PUT /api/v1/posts/:id
//@ACCESS PRIVATE
exports.updatePost = asyncHandler(async (req, resp) => {
    // GET THE ID
    const postId = req.params.id;
    // GET THE POST OBJECT FROM REQ
    const post = req.body;
    // UPDATE THIS POST IN THE DB
    const updatedPost = await Post.findByIdAndUpdate(postId, post, { new: true, runValidators: true })
    resp.json({
        status: 'success',
        message: 'Post successfully updated',
        updatedPost
    })
})

//@DESC LIKE A POST
//@ROUTE PUT /api/v1/posts/like/:postId
//@ACCESS PRIVATE
exports.likePost = asyncHandler(
    async (req, resp, next) => {
        //! GET THE POST ID
        const postId = req.params.postId;
        //! GET THE CURRENT USER
        const currentUserId = req?.userAuth?._id;
        //! SEARCH THE POST
        const post = await Post.findById(postId);
        if (!post) {
            let error = new Error('Post not found');
            next(error);
            return;
        }
        //! ADD THE CURRENT USER TO THE LIKES ARRAY
        await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: currentUserId } },
            { new: true }
        )
        //! REMOVE THE CURRENT USER FROM DISLIKES ARRAY
        post.dislikes = post.dislikes.filter(
            (userId) => userId.toString() !== currentUserId.toString()
        );
        await post.save();
        //! SEND THE RESPONSE
        resp.json({
            status: 'success',
            message: 'Post liked successfully',
        })
    }
)

//@DESC DISLIKE A POST
//@ROUTE PUT /api/v1/posts/dislike/:postId
//@ACCESS PRIVATE
exports.dislikePost = asyncHandler(
    async (req, resp, next) => {
        //! GET THE POST ID
        const postId = req.params.postId;
        //! GET THE CURRENT USER
        const currentUserId = req?.userAuth?._id;
        //! SEARCH THE POST
        const post = await Post.findById(postId);
        if (!post) {
            let error = new Error('Post not found');
            next(error);
            return;
        }
        //! ADD THE CURRENT USER TO THE DISLIKES ARRAY
        await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { dislikes: currentUserId } },
            { new: true }
        )
        //! REMOVE THE CURRENT USER FROM LIKES ARRAY
        post.likes = post.likes.filter(
            (userId) => userId.toString() !== currentUserId.toString()
        );
        await post.save();
        //! SEND THE RESPONSE
        resp.json({
            status: 'success',
            message: 'Post disliked successfully',
        })
    }
)

//@DESC CLAP A POST
//@ROUTE PUT /api/v1/posts/clap/:postId
//@ACCESS PRIVATE
exports.clapPost = asyncHandler(
    async (req, resp, next) => {
        //! GET THE POST ID
        const postId = req.params.postId;
        //! GET THE CURRENT USER
        const currentUserId = req?.userAuth?._id;
        //! SEARCH THE POST
        const post = await Post.findById(postId);
        if (!post) {
            let error = new Error('Post not found');
            next(error);
            return;
        }
        //! INCREMENT THE CLAP COUNT
        post.claps += 1;
        const savedPost = await post.save();
        //! SEND THE RESPONSE
        resp.json({
            status: 'success',
            message: 'Post clapped successfully',
            savedPost
        })
    }
)

//@ SCHEDULE POST PUBLICATION
//@ ROUTE POST /api/v1/posts/schedule/:postId
//@ ACCESS PRIVATE
exports.schedulePost = asyncHandler(
    async (req, resp, next) => {
        //! GET THE DATA
        const { postId } = req?.params;
        const scheduledPublished = req?.body?.scheduledPublished;
        //! CHECK IF POSTID AND scheduledPublished ARE PRESENT
        if (!postId || !scheduledPublished) {
            let error = new Error('Post ID and scheduled publish date are required');
            next(error);
            return;
        }
        //! FIND THE POST
        const post = await Post.findById(postId);
        if (!post) {
            let error = new Error('Post not found');
            next(error);
            return;
        }
        //! CHECK IF THE CURRENT USER IS THE AUTHOR OF THE POST
        if (post.author.toString() !== req?.userAuth?._id.toString()) {
            let error = new Error('You are not authorized to schedule this post');
            next(error);
            return;
        }
        //! CHECK IF THE SCHEDULED DATE IS IN THE FUTURE
        const scheduledDate = new Date(scheduledPublished);
        const currentDate = new Date();
        if (scheduledDate < currentDate) {
            let error = new Error('Scheduled publish date must be in the future');
            next(error);
            return;
        }
        //! UPDATE THE POST WITH THE SCHEDULED DATE
        post.scheduledPublished = scheduledDate;
        const updatedPost = await post.save();
        //! SEND THE RESPONSE
        resp.json({
            status: 'success',
            message: 'Post scheduled for publication successfully',
            updatedPost
        })
    }
)
