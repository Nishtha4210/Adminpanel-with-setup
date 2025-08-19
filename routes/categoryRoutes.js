const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Routes
router.get('/add-category', categoryController.add_category);
router.post('/insert-category-data', categoryController.insertCategoryData);
router.get('/view-category', categoryController.view_category);
router.get('/delete-category/:id', categoryController.deleteCategory);
router.get('/update-category/:id', categoryController.update_category);
router.post('/update-category-data', categoryController.updateCategoryData);

module.exports = router;
