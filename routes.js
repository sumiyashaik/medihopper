var express = require("express");
var User = require("./models/user");
var Clinic = require("./models/clinic");
var router = express.Router();
var passport = require("passport");
var ObjectID = require('mongodb').ObjectID;

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", function(req, res, next) {
    User.find()
        .sort({ createdAt: "descending" })
        .exec(function(err, users) {
            if (err) { return next(err); }
            res.render("index.ejs", { users: users });
        });
});

router.post("/search", ensureAuthenticated, function(req, res, next) {
    Clinic.find()
        .sort({ name: "ascending" })
        .exec(function(err, clinics) {
            if (err) { return next(err); }
            res.render("search", { clinics: clinics });
        });
});

router.post("/booking-confirmation", ensureAuthenticated, async function(req, res, next) {
    
    

    // current user's username
    var curUsername = res.locals.currentUser.username;

    // get clinic ID (from posted form's hidden variable)
    var clinicID = req.body.clinicID; 
    
    // push current user's username into clinic's queue
    Clinic.findOneAndUpdate(
        { _id: clinicID }, 
        { $push: { queue: curUsername } },
        ).exec();

    //console.log("clinicID: " + clinicID);
    //console.log("currentUser name: " + res.locals.currentUser.username);

    // get clinic's details to pass to confirmation page
    var clinicName, clinicAddress, clinicPostcode, clinicPhone;


    await Clinic.findOne({ _id: clinicID }, function(err, clinic) {

        if (err) { return next(err); }
        if (clinic) {
            clinicName = clinic.name;
            console.log("1. clinic name is: " + clinic.name);
            clinicAddress = clinic.address;
            clinicPostcode = clinic.postcode;
            clinicPhone = clinic.phone;
        }
    });
    

    console.log("2. clinic name is: " + clinicName);

    res.render("booking-confirmation", 
        { 
            clinicID:   clinicID, 
            name:       clinicName, 
            address:    clinicAddress, 
            postcode:   clinicPostcode,
            phone:      clinicPhone
        });
});



router.get("/signup", function(req, res) {
    res.render("signup");
});

router.post("/signup", function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ username:username }, function(err, user) {

        if (err) { return next(err); }
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }

        var newUser = new User ({
            username: username,
            password: password
        });
        newUser.save(next);

    });
    }, 
    passport.authenticate("login", {
        successRedirect: "/",
        failureRedirect: "/signup",
        failureFlash: true
}));

router.get("/login", function(req, res) {
    res.render("login");
});

//handler for POST to /login
router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//middleware to ensure users are authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

router.get("/edit", ensureAuthenticated, function(req, res) {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, function(req, res, next) {
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.save(function(err) {
        if (err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/edit");
    });
});        

module.exports = router;