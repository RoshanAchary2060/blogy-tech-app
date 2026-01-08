const jwt = require('jsonwebtoken')
const User = require('../models/users/User')
const isLoggedIn = (req, resp, next) => {
    // fetch token from req
    console.log('authorization', req.headers.authorization);
    const token = req.headers.authorization?.split(" ")[1];
    // verify token
    jwt.verify(token, "secretkey", async (err, decoded) => {
        // if unsuccessful then send the error message
        if (err) {
            return resp.status(401).json({ status: 'Failed', message: err?.message })
        } else {
            // if successful, then pass the User object to next path
            const userId = decoded?.user?._id;
            const user = await User.findById(userId).select("username email role _id");
            console.log("user", user);
            req.userAuth = user;
            next();
        }
    })
}
module.exports = isLoggedIn;