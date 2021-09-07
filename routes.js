var express = require("express");
var router = express.Router();
var User = require("./models/user");
var Clinic = require("./models/clinic");
var passport = require("passport");
const NodeGeocoder = require('node-geocoder');
var fs = require("fs");
var multer = require("multer");

// options for NodeGeocoder npm package
const options = {
    provider: 'google', 
    // Optional depending on the providers
    apiKey: 'AIzaSyCFWLMNFY6YuUNRWphBPMkfXJodkz_oMAA', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };
const geocoder = NodeGeocoder(options);

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
    // and store clinic document in variable to pass to 
    // booking confirmation page
    var clinic = await Clinic.findOneAndUpdate(
        { _id: clinicID }, 
        { $push: { queue: curUsername } },
        ).exec();

    // Gets properties of latitude and longitude based on address
    const geoResult = await geocoder.geocode(clinic.clinicAddress());
    const latitude = geoResult[0].latitude;
    const longitude = geoResult[0].longitude;
    console.log("latitude is: " + latitude);
    console.log("longitude is: " + longitude);
    
    // log message to console of user joining queue at clinic
    console.log(curUsername + " joined the queue at: " + clinic.clinicName());

    let curTime = await getCurTimeStr();
    let etaTime = await getEtaTimeStr(clinic.approxWait());
    
    res.render("booking-confirmation", 
        { 
            clinic:     clinic,
            latitude:   latitude,
            longitude:  longitude,
            key:        'AIzaSyCFWLMNFY6YuUNRWphBPMkfXJodkz_oMAA',
            curTime:    curTime,
            etaTime:    etaTime
        });
});

// Gets the current time and returns it as a String
async function getCurTimeStr() {

    var currentDateObj = new Date();

    // current hours
    let curHours = currentDateObj.getHours();

    // current minutes
    let curMinutes = currentDateObj.getMinutes();

    return (curHours + ":" + curMinutes);
}

// Gets ETA of patient (expected time of arrival), 
// based on a clinic's wait time
async function getEtaTimeStr(waitTimeHours) {
    var waitTimeMlSeconds = waitTimeHours *60 * 60 * 1000;

    var currentDateObj = new Date();
    var currentMlSeconds = currentDateObj.getTime();

    var newDateObj = new Date(currentMlSeconds + waitTimeMlSeconds);

    // eta hours
    let etaHours = newDateObj.getHours();

    // current minutes
    let etaMinutes = newDateObj.getMinutes();

    return (etaHours + ":" + etaMinutes);
}

router.get("/signup", function(req, res) {
    res.render("signup", {currentUser:res.locals.currentUser});
});

router.post("/signup", upload.single('profile-image'),function(req, res, next) {
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
    }, 
    passport.authenticate("login", {
        successRedirect: "/user-profile",
        failureRedirect: "/signup",
        failureFlash: true
}));

router.get('/user-profile', (req, res) => {
    
    res.render('user-profile');
        
});





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