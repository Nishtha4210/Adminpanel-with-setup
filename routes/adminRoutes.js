const express = require('express');
const router = express.Router();
const passport = require('passport');
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads/admins'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

// Multer upload instance
const upload = multer({ storage: storage }).single('profileImage');

// Public admin register (reuse multer/path already required above)
const storageRegister = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads/admins'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});
const uploadRegister = multer({ storage: storageRegister }).single('profileImage');

router.get('/register', adminController.registerpage);
router.post('/register', uploadRegister, adminController.register);

// Redirect /admin to /admin/dashboard
router.get('/', (req, res) => {
    return res.redirect('/admin/dashboard');
});

// Routes that require authentication

router.get('/add-admin', passport.checkAuthentication, adminController.add_admin);
router.post('/insertAdminData', upload, passport.checkAuthentication, adminController.insertAdminData);

router.get('/dashboard', passport.checkAuthentication, adminController.adminpage);
router.get('/view-admin', passport.checkAuthentication, adminController.view_admin);
router.get('/delete-admin/:adId', passport.checkAuthentication, adminController.deleteAdmin);
router.get('/update-admin', passport.checkAuthentication, adminController.update_admin);
router.post('/update-admin-data', upload, passport.checkAuthentication, adminController.updateAdminData);
router.get('/change-password', passport.checkAuthentication, adminController.changePassword);
router.post('/check-change-password', passport.checkAuthentication, adminController.checkChangePassword);
router.get('/logout', passport.checkAuthentication, adminController.logout);

module.exports = router;
