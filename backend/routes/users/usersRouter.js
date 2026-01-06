const express = require('express');
const { register } = require('../../controllers/users/usersController.js');

const usersRouter = express.Router();
usersRouter.post('/api/v1/users/register', register);

module.exports = usersRouter;