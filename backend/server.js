const express = require("express");
const dotenv = require("dotenv");
const usersRouter = require('./routes/users/usersRouter');
const connectDB = require('./config/database');
const { notFound, globalErrorHandler } = require("./middlewares/globalErrorHandler");
const categoriesRouter = require("./routes/categories/categoriesRouter");
const postsRouter = require("./routes/posts/postsRouter");
const commentsRouter = require("./routes/comments/commentsRouter");

//! Create an express app
const app = express();

//! load the environment variable
dotenv.config();

//! Establish connect to Mongodb
connectDB();

//! Setup the middleware
app.use(express.json());

//!Setup the User Router
app.use("/api/v1/users", usersRouter);

//!Setup the Category Router
app.use("/api/v1/categories", categoriesRouter)

//!Setup the Post Router
app.use('/api/v1/posts', postsRouter)

//!SETUP THE COMMENT ROUTER
app.use('/api/v1/comments', commentsRouter)

//!Not found error handler
app.use(notFound)

//!Setup the global error handler
app.use(globalErrorHandler)
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});