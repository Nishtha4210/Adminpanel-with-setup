const Admin = require('../models/Admin');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const Category = require('../models/category');

module.exports.loginpage = (req, res) => {
    return res.render('login');
};

module.exports.checkLogin = async (req, res) => {
    try {
        req.flash('success', "Login Successfully....");
        return res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        return res.render('admin/login');
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        if (req.user == undefined) {
            return res.redirect('/');
        }
        let adminId = req.user._id;
        let adminData = await Admin.findById(adminId);
        if (adminData) {
            let adminRecord = req.user;
            return res.render('admin/change-password', {
                adminRecord
            });
        }

    } catch (err) {
        console.log(err);
        return res.render('admin/login');
    }
}

module.exports.checkChangePassword = async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/');
        }

        const { oldPassword, newPassword, confirmPassword } = req.body;
        const adminId = req.user._id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            req.flash('error', 'Admin not found.');
            return res.redirect('/admin/change-password');
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);
        if (!isOldPasswordCorrect) {
            req.flash('error', 'Old password is incorrect.');
            return res.redirect('/admin/change-password');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error', 'New password and confirm password do not match.');
            return res.redirect('/admin/change-password');
        }

        const isSameAsOld = await bcrypt.compare(newPassword, admin.password);
        if (isSameAsOld) {
            req.flash('error', 'New password must be different from old password.');
            return res.redirect('/admin/change-password');
        }

        admin.password = newPassword; // will be hashed by pre-save hook
        await admin.save();

        req.flash('success', 'Password changed successfully. Please log in again.');
        return res.redirect('/admin/logout');
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred while changing the password.');
        return res.redirect('/admin/change-password');
    }
}

module.exports.logout = async (req, res) => {
    try {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            return res.redirect('/');
        })
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
}

module.exports.adminpage = async (req, res) => {
    try {
        const [adminCount, blogCount, categoryCount] = await Promise.all([
            Admin.countDocuments(),
            Blog.countDocuments(),
            Category.countDocuments()
        ]);
        return res.render('dashboard', {
            stats: { adminCount, blogCount, categoryCount }
        });
    } catch (err) {
        console.log(err);
        return res.redirect('/');
    }
};

// Public admin register page
module.exports.registerpage = (req, res) => {
    try {
        return res.render('admin/register');
    } catch (err) {
        console.log(err);
        return res.redirect('/login');
    }
};

// Public admin register handler
module.exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, contactNumber, gender, description } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password || !contactNumber || !gender) {
            req.flash('error', 'Please fill in all required fields.');
            return res.redirect('/admin/register');
        }

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            req.flash('error', 'Admin with this email already exists.');
            return res.redirect('/admin/register');
        }

        let imagePath = '';
        if (req.file) {
            imagePath = Admin.adPath + '/' + req.file.filename;
        } else {
            // Use seeded default if available
            imagePath = '/uploads/admins/seed-default.png';
        }

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password,
            contactNumber,
            gender,
            hobby: Array.isArray(req.body.hobby) ? req.body.hobby : (req.body.hobby ? [req.body.hobby] : []),
            description,
            profileImage: imagePath
        });

        await newAdmin.save();
        req.flash('success', 'Registration successful. Please log in.');
        return res.redirect('/login');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error while registering admin.');
        return res.redirect('/admin/register');
    }
};

module.exports.add_admin = async (req, res) => {
    try {
        // This page is now public to allow creating the first admin.
        // The view should handle cases where adminRecord is not present.
        let adminRecord = null;
        if (req.user) {
            adminRecord = await Admin.findById(req.user._id);
        }
        return res.render('admin/add-admin', {
            adminRecord: adminRecord
        });
    } catch (err) {
        console.log(err);
        req.flash('error', 'Error loading the page');
        return res.redirect(req.get('Referrer') || '/');
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        let adminId = req.params.adId;
        let adminData = await Admin.findById(adminId);

        if (adminData) {
            if (adminData.profileImage) {
                let imgPath = path.join(__dirname, "..", adminData.profileImage);
                try {
                    fs.unlinkSync(imgPath);
                    console.log("Profile image file deleted successfully");
                } catch (err) {
                    console.log("Error while deleting profile image:", err);
                }
            }

            let deleteAdminData = await Admin.findByIdAndDelete(adminId);

            if (deleteAdminData) {
                console.log("Admin Record Deleted Successfully");
                req.flash('success', "Admin Record Deleted Successfully....");
                return res.redirect('/admin/view-admin');
            } else {
                console.log("Error While Deleting Admin Record...");
                req.flash('success', "Error While Deleting Admin Record....");
                return res.redirect('/admin/view-admin');
            }
        } else {
            console.log("Admin Record Not Found");
            return res.redirect('/admin/view-admin');
        }

    } catch (err) {
        console.log(err);
        return res.redirect('/admin/view-admin');
    }
}

module.exports.update_admin = async (req, res) => {
    try {
        let adminId = req.query.adminId;
        let oldAdminData = await Admin.findById(adminId);
        if (oldAdminData) {
            return res.render('admin/update-admin', {
                oldAdminData
            });
        }
        else {
            console.log("Record not Found...");
            return res.redirect('/admin/view-admin')
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports.updateAdminData = async (req, res) => {
    try {
        let adminId = req.body.adminId;
        let adminData = await Admin.findById(adminId);

        if (adminData) {
            // Check if the new adminId is unique (if it's being changed)
            if (req.body.adminId && req.body.adminId !== adminData.adminId) {
                const adminIdExists = await Admin.findOne({ adminId: req.body.adminId });
                if (adminIdExists) {
                    req.flash('error', 'Admin ID already exists.');
                    return res.redirect('/admin/view-admin');
                }
            }

            let updatedData = {
                ...req.body
            };

            if (req.file) {
                if (adminData.profileImage) {
                    let imgPath = path.join(__dirname, "..", adminData.profileImage);
                    try {
                        fs.unlinkSync(imgPath);
                    } catch (err) {
                        console.log("Error while deleting old profile image:", err);
                    }
                }
                updatedData.profileImage = Admin.adPath + '/' + req.file.filename;
            }

            await Admin.findByIdAndUpdate(adminId, updatedData);
            req.flash('success', 'Admin record updated successfully');
            return res.redirect('/admin/view-admin');
        } else {
            req.flash('error', 'Admin record not found');
            return res.redirect('/admin/view-admin');
        }
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred while updating the admin record');
        return res.redirect('/admin/view-admin');
    }
};

module.exports.view_admin = async (req, res) => {
    try {
        let adminRecord = await Admin.find({});
        // console.log(adminRecord);
        if (adminRecord) {
            return res.render('admin/view-admin', {
                admins: adminRecord
            });
        } else {
            return res.render('admin/view-admin');
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports.insertAdminData = async (req, res) => {
    try {
        let imagePath = '';
        if (req.file) {
            imagePath = Admin.adPath + '/' + req.file.filename;
        } else {
            req.flash('error', 'Profile image is required.');
            return res.redirect(req.get('Referrer') || '/');
        }

        const adminExists = await Admin.findOne({ email: req.body.email });

        if (adminExists) {
            fs.unlinkSync(path.join(__dirname, '..', imagePath));
            req.flash('error', 'Admin with this email already exists.');
            return res.redirect(req.get('Referrer') || '/');
        }

        // Check if adminId is provided and if it's unique
        if (req.body.adminId && req.body.adminId.trim()) {
            const adminIdExists = await Admin.findOne({ adminId: req.body.adminId.trim() });
            if (adminIdExists) {
                fs.unlinkSync(path.join(__dirname, '..', imagePath));
                req.flash('error', 'Admin ID already exists.');
                return res.redirect(req.get('Referrer') || '/');
            }
        }

        const newAdmin = new Admin({
            adminId: req.body.adminId && req.body.adminId.trim() ? req.body.adminId.trim() : undefined, // Let model auto-generate if empty
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            contactNumber: req.body.contactNumber,
            gender: req.body.gender,
            hobby: Array.isArray(req.body.hobby) ? req.body.hobby : (req.body.hobby ? [req.body.hobby] : []),
            description: req.body.description,
            profileImage: imagePath
        });

        await newAdmin.save();

        req.flash('success', 'Admin added successfully!');
        return res.redirect('/admin/view-admin');

    } catch (err) {
        console.log('Error in insertAdminData:', err);
        req.flash('error', 'Error in adding admin.');
        return res.redirect(req.get('Referrer') || '/');
    }
}
