// import required modules
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var morgan = require("morgan");

// initialise express app
var app = express();

// require files
var setUpPassport = require("./setuppassport");

// path to mongo database
var uri = "mongodb+srv://cluster0.7hvms.mongodb.net/";

// connect to DB
mongoose
  .connect(
    uri,
    {
      dbName: 'MediHopperDB',
      user: 'admin',
      pass: '00000',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }   
  )
  .then(
      () => {
          console.log('MongoDB connected...');
          setUpPassport();
          console.log('Passport setup complete...');
      }
  )

// define port number
const port = 4000;

//================================================================
//      middleware stack
//----------------------------------------------------------------

// set views dir and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// http request logger
app.use(morgan('tiny'));

// json and url parse
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));

// cookie parse
app.use(cookieParser());

// user session middleware
app.use(session ({
  secret: "asdjDsLKsjkjJlkK3*32h#$%wlkj@#s.<<MX",
  resave: true,
  saveUninitialized: true
}));

// connect-flash messages middleware
app.use(flash());

// passport.js authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// serve static files
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/views/images'));

// middleware routers
const userRouter = require(`./routers/user`);
const clinicRouter = require('./routers/clinic');
app.use('/', userRouter);
app.use('/clinic', clinicRouter);


// middleware for invalid routes
app.use(function(req, res) {
  res.status(404);
  req.flash("error", "404 ERROR: Invalid route. Redirecting to home.");
  res.redirect("/");
});

// listen for http requests
app.listen(port, function() {
  console.log("Server is running on port: " + port);
});
