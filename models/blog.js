const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: false
    },
    authorName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    readingTime: {
        type: Number,
        default: 1
    },
    slug: {
        type: String,
        unique: true,
        index: true
    }
}, { timestamps: true });

blogSchema.statics.blogPath = '/uploads/blogs';

// Helpers
function generateSlug(title) {
    return title.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Pre-validate to ensure slug and readingTime
blogSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = generateSlug(this.title);
    }
    if (!this.summary && this.content) {
        this.summary = this.content.substring(0, 160);
    }
    if (this.content) {
        const words = this.content.split(/\s+/).filter(Boolean).length;
        this.readingTime = Math.max(1, Math.ceil(words / 200));
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;