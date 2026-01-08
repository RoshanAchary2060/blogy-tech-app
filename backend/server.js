const express = require("express");
const dotenv = require("dotenv");
const usersRouter = require('./routes/users/usersRouter');
const connectDB = require('./config/database');
const { notFound, globalErrorHandler } = require("./middlewares/globalErrorHandler");

//! Create an express app
const app = express();

//! load the environment variable
dotenv.config();

//! Establish connect to Mongodb
connectDB();

//! Setup the middleware
app.use(express.json());

//?Setup the Router
app.use("/api/v1/users", usersRouter);

//?Not found error handler
app.use(notFound)

//?Setup the global error handler
app.use(globalErrorHandler)
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});