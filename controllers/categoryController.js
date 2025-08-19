const Category = require('../models/category');

module.exports.add_category = async (req, res) => {
    try {
        return res.render('category/add-category');
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.insertCategoryData = async (req, res) => {
    try {
        let category = await Category.create(req.body);
        if (category) {
            req.flash('success', 'Category added successfully');
        } else {
            req.flash('error', 'Failed to add category');
        }
        return res.redirect('/category/add-category');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred');
        return res.redirect('back');
    }
};

module.exports.view_category = async (req, res) => {
    try {
        let categories = await Category.find({});
        return res.render('category/view-category', {
            categories
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        req.flash('success', 'Category deleted successfully');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred');
        return res.redirect('back');
    }
};

module.exports.update_category = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        return res.render('category/update-category', {
            category
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.updateCategoryData = async (req, res) => {
    try {
        await Category.findByIdAndUpdate(req.body.id, req.body);
        req.flash('success', 'Category updated successfully');
        return res.redirect('/category/view-category');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred');
        return res.redirect('back');
    }
};
