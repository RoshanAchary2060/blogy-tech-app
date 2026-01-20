const jwt = require('jsonwebtoken')
const User = require('../models/users/User')

const isLoggedIn = (req, resp, next) => {
    // fetch token from req
    const token = req.headers.authorization?.split(" ")[1];
    // verify token
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
        // if unsuccessful then send the error message
        if (err) {
            const error = new Error(err?.message);
            next(error)
        } else {
            // if successful, then pass the User object to next path
            const userId = decoded?.user?._id;
            const user = await User.findById(userId).select("username email role _id");
            req.userAuth = user;
            next();
        }
    })
}
module.exports = isLoggedIn;