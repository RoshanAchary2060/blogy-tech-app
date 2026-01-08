const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/blogytech");
        console.log("Connected successfully to mongodb");

    } catch (error) {
        console.log('Connection to mongodb failed:', error.message);
    }
};
module.exports = connectDB;
