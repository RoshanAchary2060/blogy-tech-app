const express = require('express');
const { register, login, getProfile, blockUser, unblockUser, viewOtherProfile, followingUser, unfollowingUser, forgotPassword, resetPassword, sendAccountVerificationEmail, verifyAccount } = require('../../controllers/users/usersController.js');
const isLoggedIn = require('../../middlewares/isLoggedIn.js')
const usersRouter = express.Router();

usersRouter.post('/register', register);
usersRouter.post('/login', login)
usersRouter.get('/profile', isLoggedIn, getProfile)
usersRouter.put('/block/:userIdToBlock', isLoggedIn, blockUser)
usersRouter.put('/unblock/:userIdToUnblock', isLoggedIn, unblockUser)
usersRouter.get('/view-another-profile/:userProfileId', isLoggedIn, viewOtherProfile)
usersRouter.put('/following/:userIdToFollow', isLoggedIn, followingUser)
usersRouter.put('/unfollowing/:userIdToUnfollow', isLoggedIn, unfollowingUser)
usersRouter.post('/forgot-password', forgotPassword);
usersRouter.put('/reset-password/:resetToken', resetPassword);
usersRouter.put('/account-verification-email', isLoggedIn, sendAccountVerificationEmail);
usersRouter.put('/verify-account/:verificationToken', isLoggedIn, verifyAccount);

module.exports = usersRouter;