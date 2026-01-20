const express = require('express')
const { createCategory, getAllCategories, deleteCategory, updateCategory } = require('../../controllers/categories/categoriesController')
const isLoggedIn = require('../../middlewares/isLoggedIn')

const categoriesRouter = express.Router();

//! Create Category Route
categoriesRouter.post('/', isLoggedIn, createCategory)
//! Get All Categories Route
categoriesRouter.get('/', getAllCategories)
categoriesRouter.delete('/:id', isLoggedIn, deleteCategory)
categoriesRouter.put('/:id', isLoggedIn, updateCategory)
module.exports = categoriesRouter;