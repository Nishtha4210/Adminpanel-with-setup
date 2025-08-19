const Blog = require('../models/blog');
const Category = require('../models/category');
const fs = require('fs');
const path = require('path');

module.exports.add_blog = async (req, res) => {
    try {
        let categories = await Category.find({});
        return res.render('blog/add-blog', {
            categories,
            admin: req.user
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.insertBlogData = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file) {
            imagePath = Blog.blogPath + '/' + req.file.filename;
        }
        req.body.blogImage = imagePath;
        req.body.authorName = req.body.authorName; // Save the manually entered author name
        req.body.author = req.user._id; // Assuming admin is logged in
        let blog = await Blog.create(req.body);
        if (blog) {
            req.flash('success', 'Blog post added successfully');
        } else {
            req.flash('error', 'Failed to add blog post');
        }
        return res.redirect('/blog/add-blog');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred');
        return res.redirect('back');
    }
};

module.exports.view_blog = async (req, res) => {
    try {
        let blogs = await Blog.find({}).populate('author').populate('category');
        return res.render('blog/view-blog', {
            blogs
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.deleteBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (blog.blogImage) {
            fs.unlinkSync(path.join(__dirname, '..', blog.blogImage));
        }
        await Blog.findByIdAndDelete(req.params.id);
        req.flash('success', 'Blog post deleted successfully');
        return res.redirect('back');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred');
        return res.redirect('back');
    }
};

module.exports.update_blog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);
        let categories = await Category.find({});
        return res.render('blog/update-blog', {
            blog,
            categories
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.updateBlogData = async (req, res) => {
    try {
        if (req.file) {
            let oldBlog = await Blog.findById(req.body.id);
            if (oldBlog.blogImage) {
                fs.unlinkSync(path.join(__dirname, '..', oldBlog.blogImage));
            }
            req.body.blogImage = Blog.blogPath + '/' + req.file.filename;
        }
        await Blog.findByIdAndUpdate(req.body.id, req.body);
        req.flash('success', 'Blog post updated successfully');
        return res.redirect('/blog/view-blog');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred');
        return res.redirect('back');
    }
};
