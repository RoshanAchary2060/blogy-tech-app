const User = require('../models/users/User')
const isAccountVerified = async (req, res, next) => {
    try {
        //! FIND USER BY ID AND CHECK IF VERIFIED
        const currentUser = await User.findById(req.userAuth._id);
        if (!currentUser) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (!currentUser.isVerified) {
            return res.status(401).json({ message: 'Account not verified' });
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        });
    }
};

module.exports = isAccountVerified;