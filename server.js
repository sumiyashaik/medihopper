var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
//var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");

var routes = require("./routes");
var app = express();

var uri = "mongodb+srv://cluster0.7hvms.mongodb.net/";

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
      }
  )

const port = 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));
app.use(cookieParser());
app.use(session ({
  secret: "asdjDsLKsjkjJlkK3*32h#$%wlkj@#s.<<MX",
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(routes);
//app.use(express.static(__dirname + '/Views'));
//app.use(bodyParser.urlencoded({extended: false }));

app.listen(port, function() {
  console.log("Server is running on port: " + port);
});
