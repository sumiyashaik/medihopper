var express = require("express");
var passport = require("passport");
var multer = require("multer");

var UserController = require('../controllers/user');
var Utils = require('../utils/utils');

var router = express.Router();

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

// Upload profile image file to 'uploads' folder in disk storage
// using multer's diskStorage method
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({storage});




router.get("/", UserController.homepage);

router.get("/signup", UserController.signUpForm);

router.post("/signup", upload.single('profile-image'), 
                UserController.signup, 
                passport.authenticate("login", {
                    successRedirect: "/user-profile",
                    failureRedirect: "/signup",
                    failureFlash: true
            }));

router.get('/user-profile', UserController.userprofile);

router.get("/login", UserController.loginForm);

//handler for POST to /login
router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", UserController.logout);

router.get("/edit", Utils.ensureAuthenticated, UserController.editForm);

router.post("/edit", Utils.ensureAuthenticated, UserController.edit);


module.exports = router;
