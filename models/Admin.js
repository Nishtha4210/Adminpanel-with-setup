const mongoose = require('mongoose');
const multer = require('multer'); // added multer library
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    adminId: {
        type: String,
        unique: true,
        index: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    hobby: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
AdminSchema.virtual('name').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Generate adminId before validation if missing
AdminSchema.pre('validate', async function (next) {
    if (!this.adminId) {
        const count = await this.constructor.countDocuments();
        this.adminId = `ADM${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

// Pre-save hook to hash password
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

AdminSchema.statics.adPath = '/uploads/admins'; // added static path 'adPath'

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
