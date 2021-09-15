// import required modules
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
const bodyParser = require("body-parser");
var flash = require("connect-flash");
var morgan = require("morgan");

// initialise express app
var app = express();

// require files
var setUpPassport = require("./setuppassport");

const server = require("http").createServer(app);




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

// cookie parse
app.use(cookieParser());


// user session middleware
const sessionMiddleware = session ({
  secret: "asdjDsLKsjkjJlkK3*32h#$%wlkj@#s.<<MX",
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware);

// connect-flash messages middleware
app.use(flash());

// passport.js authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// json and url parser middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));


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









const io = require('socket.io')(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});


var users = {};

io.on('connect', (socket) => {
  console.log(`new connection ${socket.id}`);

  socket.on('disconnect', () => {    
    console.log('user disconnected');  
  });
  
  socket.on('whoami', (cb) => {
    cb(socket.request.user ? socket.request.user.username : '');
  });

  //map usernames to their socket ID's as key-value pairs
  users[socket.request.user.username] = socket.id;

  const session = socket.request.session;
  console.log(`saving sid ${socket.id} in session ${session.id}`);
  session.socketId = socket.id;
  session.save();

  socket.on('from message', (data) => {    
    console.log(`${data.fromUsername} (${data.socketId}) says: ${data.msg}`);

    io.to(users[data.toUsername]).emit('to message', data);
  });

  

});









// listen for http requests
server.listen(port, function() {
  console.log("Server is running on port: " + port);
});
