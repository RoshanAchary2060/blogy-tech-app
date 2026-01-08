const jwt = require('jsonwebtoken')
const generateToken = (user) => {
    const payLoad = {
        user: {
            _id: user._id,
        }
    };
    const token = jwt.sign(payLoad, 'secretkey', { expiresIn: 3600 })
    return token;
}
module.exports = generateToken;