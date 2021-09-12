var User = require("../models/user");
var fs = require("fs");

function homepage(req, res, next) {
    User.find()
        .sort({ createdAt: "descending" })
        .exec(function(err, users) {
            if (err) { return next(err); }
            res.render("index.ejs", { users: users });
        });
}

function signUpForm (req, res) {
    res.render("signup", {currentUser:res.locals.currentUser});
}

function signup (req, res, next) {
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
        console.log("req.file is: " + req.file);
        console.log("req.file.filename is: " + req.file.filename);
        console.log("req.file.path is: " + req.file.path);
        console.log("req.file.fieldname is: " + req.file.fieldname);
        //console.log("req.files[0].fieldname is: " + req.files[0].fieldname);

        newUser.profileImage.data = fs.readFileSync(req.file.path);
        newUser.profileImage.contentType = 'image/png';
        newUser.save(next);
    });
}

function userprofile (req, res) { 
    res.render('user-profile');  
}

function loginForm (req, res) {
    res.render("login");
}

function logout (req, res) {
    req.logout();
    res.redirect("/");
}

function editForm (req, res) {
    res.render("edit-profile");
}

function edit (req, res, next) {
    //console.log("req.body is: " + req.body);
    //console.log("req.body.street is: " + req.body.street);
    
    req.user.name.given = req.body.given;
    req.user.name.middle = req.body.middle;
    req.user.name.family = req.body.family;
    req.user.dob = req.body.dob;
    req.user.address.street = req.body.street;
    req.user.address.city = req.body.city;
    req.user.address.state = req.body.state;
    req.user.address.postcode = req.body.postcode;
    req.user.mobile = req.body.mobile;
    req.user.email = req.body.email;

    
    if (typeof req.file !== 'undefined') {
        req.user.profileImage.data = fs.readFileSync(req.file.path);
        req.user.profileImage.contentType = 'image/png';
    }

    //console.log("req.user is: " + req.user);

    req.user.save(function(err) {
        if (err) {
            next(err);
            return;
        }
        req.flash("info", "Profile updated!");
        res.redirect("/user-profile");
        //res.render('user-profile');
    });
    
   //res.send(req.body);
}

module.exports = {
    homepage,
    signUpForm,
    signup,
    userprofile,
    loginForm,
    logout,
    editForm,
    edit
}