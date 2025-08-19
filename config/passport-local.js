const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// authentication using passport for admin
passport.use('admin-local', new LocalStrategy({
        usernameField: 'email'
    },
    async function(email, password, done){
        try {
            // find a user and establish the identity
            let admin = await Admin.findOne({email: email});

            if (!admin) {
                console.log('Incorrect Email');
                return done(null, false, { message: 'Incorrect email.' });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                console.log('Incorrect Password');
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, admin);
        } catch (err) {
            console.log('Error in finding admin ---> Passport');
            return done(err);
        }
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    // Check if it's an admin or user and store type info
    if (user.email && user.firstName) {
        // This is an admin (has firstName field)
        done(null, { id: user.id, type: 'admin' });
    } else {
        // This is a regular user
        done(null, { id: user.id, type: 'user' });
    }
});

// deserializing the user from the key in the cookies
passport.deserializeUser(async function(obj, done){
    try {
        if (obj.type === 'admin') {
            let admin = await Admin.findById(obj.id);
            return done(null, admin);
        } else if (obj.type === 'user') {
            const User = require('../models/User');
            let user = await User.findById(obj.id);
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.log('Error in finding user ---> Passport');
        return done(err);
    }
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // Only allow authenticated admins into admin routes
    if (req.isAuthenticated() && req.user && req.user.firstName){
        return next();
    }
    // If not authenticated (or authenticated as non-admin), go to admin login
    return res.redirect('/login');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        if (req.user && req.user.firstName) {
            // This is an admin
            res.locals.admin = req.user;
        } else if (req.user && req.user.name) {
            // This is a regular user
            res.locals.user = req.user;
        }
    }

    next();
}

module.exports = passport;
