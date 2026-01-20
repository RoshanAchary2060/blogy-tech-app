const bcrypt = require('bcryptjs')
const User = require('../../models/users/User');
const generateToken = require('../../utils/generateToken')
const asyncHandler = require("express-async-handler")
const sendEmail = require('../../utils/sendEmail');
const sendAccountVerificationEmail = require('../../utils/sendAccountVerificationEmail');
const crypto = require('crypto');

//@desc Register new user
//@route POST /api/v1/users/register
//@access public
exports.register = asyncHandler(
    async (req, resp, next) => {
        const { username, password, email } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            throw new Error('User Already Existing!');
        }
        const newUser = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        resp.json({
            status: 'success',
            message: 'User registered successfully',
            _id: newUser?.id,
            username: newUser?.username,
            email: newUser?.email,
            role: newUser?.role,
        })
    }
)

//@desc Login new user
//@route POST /api/v1/users/login
//@access public
exports.login = asyncHandler(
    async (req, resp, next) => {

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid credentials!');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials!');
        }
        user.lastLogin = new Date();
        await user.save();
        resp.json({
            status: 'success',
            email: user?.email,
            _id: user?._id,
            username: user?.username,
            role: user?.role,
            token: generateToken(user),
        });
    }
)

//@desc Profile view
//@route GET /api/v1/users/profile/:id
//@access private
exports.getProfile = asyncHandler(
    async (req, resp) => {
        const user = await User.findById(req.userAuth._id)
            .populate({
                path: 'posts',
                model: 'Post',
            }).populate({
                path: 'following'
                , model: 'User'
            }).populate({
                path: 'followers',
                model: 'User'
            })
            .populate({
                path: 'blockedUser',
                model: 'User'
            }).
            populate({
                path: 'profileViewers',
                model: 'User'
            })
            ;
        //! RETURN THE RESPONSE    
        resp.json({
            status: 'success',
            message: 'Profile fetched',
            user
        })
    }
);

//@DESC BLOCK USER
//@ROUTE PUT /api/v1/users/block/userIdToBlock
//@access PRIVATE
exports.blockUser = asyncHandler(
    async (req, resp, next) => {
        //! FIND THE USERID TO BE BLOCKED
        const userIdToBlock = req.params.userIdToBlock;
        //! CHECK WHETHER THE USER IS PRESENT IN DB OR NOT
        const userToBlock = await User.findById(userIdToBlock)
        //! IF USER IS NOT FOUND GIVE ERROR MSG
        if (!userToBlock) {
            let error = new Error('User to block not found!')
            next(error)
            return;
        }
        //! GET THE CURRENT USER ID
        const userBlocking = req?.userAuth?._id;
        //! CHECK IF HE IS SELF BLOCKING
        if (userIdToBlock.toString() === userBlocking.toString()) {
            let error = new Error('Cannot block yourself!');
            next(error);
            return;
        }
        //! GET CURRENT USER OBJ FROM DB
        const currentUser = await User.findById(userBlocking);
        //! CHECK WHETHER THE USERIDTOBLOCK IS ALREADY BLOCKED
        if (currentUser.blockedUser.includes(userIdToBlock)) {
            let error = new Error("This user has already been blocked!")
            next(error);
            return;
        }
        //! PUSH THE USER TO BE BLOCKED IN THE BLOCKEDUSER ARRAY
        currentUser.blockedUser.push(userIdToBlock)
        await currentUser.save();
        resp.json({
            status: 'success',
            message: 'User blocked successfully',
        })
    }
)

//@DESC UNBLOCK USER
//@ROUTE PUT /api/v1/users/unblock/userIdToUnblock
//@ACCESS PRIVATE
exports.unblockUser = asyncHandler(
    async (req, resp, next) => {
        //! FIND THE USERID TO BE UNBLOCKED
        const userIdToUnblock = req.params.userIdToUnblock;
        //! CHECK WHETHER THE USER IS PRESENT IN DB OR NOT
        const userToUnblock = await User.findById(userIdToUnblock)
        //! IF USER IS NOT FOUND GIVE ERROR MSG
        if (!userToUnblock) {
            let error = new Error('User to unblock not found!')
            next(error)
            return;
        }
        //! GET THE CURRENT USER ID
        const userUnblocking = req?.userAuth?._id;
        //! CHECK IF HE IS SELF UNBLOCKING
        if (userIdToUnblock.toString() === userUnblocking.toString()) {
            let error = new Error('Cannot unblock yourself!');
            next(error);
            return;
        }
        //! GET CURRENT USER OBJ FROM DB
        const currentUser = await User.findById(userUnblocking);

        //! CHECK WHETHER THE USERIDTOUNBLOCK IS BLOCKED
        if (!currentUser.blockedUser.includes(userIdToUnblock)) {
            let error = new Error("This user is not blocked!")
            next(error);
            return;
        }
        //! REMOVE THE USER FROM THE CURRENT USER BLOCKEDUSER ARRAY
        currentUser.blockedUser = currentUser.blockedUser.filter((id) => {
            return id.toString() !== userIdToUnblock
        })
        //! UPDATE THE DB
        await currentUser.save();
        resp.json({
            status: 'success',
            message: 'User unblocked successfully',
        })
    }
)

//@DESC VIEW ANOTHER USER PROFILE
//@ROUTE GET /api/v1/users/view-another-profile/:userProfileId
//@ACCESS PRIVATE
exports.viewOtherProfile = asyncHandler(
    async (req, resp, next) => {
        //! GET THE USERID WHOSE PROFILE IS TO BE VIEWED
        const userProfileId = req.params.userProfileId
        //! CHECK IF USER IS IN DB OR NOT
        const userProfile = await User.findById(userProfileId);
        if (!userProfile) {
            let error = new Error('User whose profile is to be viewed not present!')
            next(error);
            return;
        }
        const currentUserId = req?.userAuth?._id;
        //! CHECK IF WE HAVE ALREADY VIEWED THEIR PROFILE
        if (userProfile.profileViewers.includes(currentUserId)) {
            let error = new Error("You have already viewed the profile!")
            next(error);
            return;
        }
        //! PUSH THE CURRENTUSERID INTO ARRAY OF USERPROFILE
        userProfile.profileViewers.push(currentUserId);
        //! UPDATE THE DB
        await userProfile.save();
        //! RETURN THE RESPONSE
        resp.json({
            status: 'success',
            message: 'Profile successfully viewed',
        })
    }
)

//@DESC FOLLOW USER
//@ROUTE PUT /api/v1/users/following/:userIdToFollow
//@ACCESS PRIVATE
exports.followingUser = asyncHandler(
    async (req, resp, next) => {
        const currentUserId = req?.userAuth?._id;
        //! FIND THE USER TO BE FOLLOWED
        const userIdToFollow = req.params.userIdToFollow
        //! CHECK IF USER IS IN DB OR NOT
        const userProfile = await User.findById(userIdToFollow);
        if (!userProfile) {
            let error = new Error('User to be followed not present!')
            next(error);
            return;
        }

        //! AVOID CURRENT USER FOLLOWING HIMSELF
        if (currentUserId.toString() === userIdToFollow.toString()) {
            let error = new Error("You cannot follow yourself!")
            next(error);
            return;
        }

        //! PUSH THE ID OF USER TO FOLLOW INSIDE FOLLOWING ARRAY OF CURRENT USER
        await User.findByIdAndUpdate(
            currentUserId,
            {
                $addToSet: { following: userIdToFollow },
            },
            { new: true }
        )
        //! PUSH THE CURRENT USERID INTO THE FOLLOWERS ARRAY OF USERTOFOLLOW
        await User.findByIdAndUpdate(
            userIdToFollow,
            {
                $addToSet: { followers: currentUserId },
            },
            { new: true }
        )
        //! SEND THE RESPONSE
        resp.json({
            status: 'status',
            message: 'You have successfully followed the user'
        })
    }
)

//@DESC UNFOLLOW USER
//@ROUTE PUT /api/v1/users/unfollowing/:userIdToUnfollow
//@ACCESS PRIVATE
exports.unfollowingUser = asyncHandler(
    async (req, resp, next) => {
        //! GET CURRENT USER ID
        const currentUserId = req?.userAuth?._id;

        //! FIND THE USER TO BE UNFOLLOWED
        const userIdToUnfollow = req.params.userIdToUnfollow

        //! CHECK IF USER IS IN DB OR NOT
        const userProfile = await User.findById(userIdToUnfollow);
        if (!userProfile) {
            let error = new Error('User to be unfollowed not present!')
            next(error);
            return;
        }

        //! AVOID CURRENT USER UNFOLLOWING HIMSELF
        if (currentUserId.toString() === userIdToUnfollow.toString()) {
            let error = new Error("You cannot unfollow yourself!")
            next(error);
            return;
        }

        //! GET THE CURRENT USER OBJ
        const currentUser = await User.findById(currentUserId)

        //! CHECK WHETHER THE CURRENT USER HAS FOLLOWED USERIDTOUNFOLLOW OR NOT
        if (!currentUser.following.includes(userIdToUnfollow)) {
            let error = new Error('You cannot unfollow the user you did not follow')
            next(error)
            return;
        }

        //! REMOVE THE USER ID TO UNFOLLOW FROM THE FOLLOWING ARRAY
        await User.findByIdAndUpdate(
            currentUserId,
            {
                $pull: { following: userIdToUnfollow }
            },
            { new: true }
        )

        //! REMOVE THE CURRENT USER ID  FROM THE FOLLOWERS ARRAY of Usertounfollow
        await User.findByIdAndUpdate(
            userIdToUnfollow,
            {
                $pull: { followers: currentUserId }
            },
            { new: true }
        )

        //! SEND THE RESPONSE
        resp.json({
            status: 'status',
            message: 'You have successfully unfollowed the user'
        })
    }
)

//@DESC FORGOT PASSWORD
//@ROUTE POST /api/v1/users/forgot-password
//@ACCESS PUBLIC
exports.forgotPassword = asyncHandler(
    async (req, resp, next) => {
        //! FETCH THE EMAIL
        const { email } = req.body;
        //! FIND EMAIL IN THE DB
        const userFound = await User.findOne({ email })
        if (!userFound) {
            let error = new Error('This email id is not registered with us!');
            next(error);
            return;
        }
        //! GET THE RESET TOKEN
        const resetToken = await userFound.generatePasswordResetToken();
        await userFound.save();
        sendEmail(email, resetToken);
        //! SEND RESPONSE
        resp.json({
            status: 'success',
            message: 'Password reset token sent to your email successfully',
        })
    }
)

//@DESC RESET PASSWORD
//@ROUTE PUT /api/v1/users/reset-password/:resetToken
//@ACCESS PUBLIC
exports.resetPassword = asyncHandler(
    async (req, resp, next) => {
        //! FETCH THE RESET TOKEN FROM PARAMS
        const resetToken = req.params.resetToken;

        //! HASH THE TOKEN
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        //! VERIFY THE TOKEN AND EXPIRY
        const userFound = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })
        if (!userFound) {
            let error = new Error('Invalid or expired token');
            next(error);
            return;
        }

        //! UPDATE THE NEW PASSWORD
        const salt = await bcrypt.genSalt(10);
        const { password } = req.body;
        userFound.password = await bcrypt.hash(password, salt);
        userFound.passwordResetToken = undefined;
        userFound.passwordResetExpires = undefined;

        //! RESAVE THE USER
        await userFound.save();

        //! SEND RESPONSE
        resp.json({
            status: 'success',
            message: 'Password reset successfully'
        })
    }
)

//@DESC SEND ACCOUNT VERIFICATION EMAIL
//@ROUTE POST /api/v1/users/account-verification-email
//@ACCESS PRIVATE
exports.sendAccountVerificationEmail = asyncHandler(
    async (req, resp, next) => {
        //! FIND THE CURRENT USER'S EMAIL
        const userEmail = req?.userAuth?.email;
        console.log('user email1', userEmail);
        //! FIND THE USER IN DB
        const user = await User.findOne({ email: userEmail });
        //! GENERATE THE VERIFICATION TOKEN
        const verificationToken = user.generateAccountVerificationToken();
        //! RESAVE THE USER
        await user.save();
        //! SEND EMAIL
        sendAccountVerificationEmail(userEmail, verificationToken);
        //! SEND RESPONSE
        resp.json({
            status: 'success',
            message: 'Account verification email sent successfully',
        })
    }
)

//@DESC ACCOUNT TOKEN VERIFICATION
//@ROUTE GET /api/v1/users/verify-account/:verificationToken
//@ACCESS PRIVATE
exports.verifyAccount = asyncHandler(
    async (req, resp, next) => {
        //! FETCH THE VERIFICATION TOKEN FROM PARAMS
        const verificationToken = req.params.verificationToken;
        console.log('verification token', verificationToken);
        //! HASH THE TOKEN
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        //! VERIFY THE TOKEN AND EXPIRY
        const userFound = await User.findOne({
            accountVerificationToken: hashedToken,
            accountVerificationExpires: { $gt: Date.now() }
        })
        console.log('user found', userFound !== null);
        if (!userFound) {
            let error = new Error('Invalid or expired token');
            next(error);
            return;
        }
        //! UPDATE THE ACCOUNT STATUS
        userFound.isVerified = true;
        userFound.accountVerificationToken = undefined;
        userFound.accountVerificationExpires = undefined;
        //! RESAVE THE USER
        await userFound.save();
        //! SEND RESPONSE
        resp.json({
            status: 'success',
            message: 'Account verified successfully'
        })
    }
)
