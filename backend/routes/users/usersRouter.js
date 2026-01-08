const express = require('express');
const { register, login, getProfile } = require('../../controllers/users/usersController.js');
const isLoggedIn = require('../../middlewares/isLoggedIn.js')
const usersRouter = express.Router();
usersRouter.post('/register', register);
usersRouter.post('/login', login)
usersRouter.get('/profile', isLoggedIn, getProfile)

module.exports = usersRouter;