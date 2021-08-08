const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);

const port = 4000;


var uri = "mongodb+srv://cluster0.7hvms.mongodb.net/";

const mongoose = require("mongoose");

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

let homePage = require('./Views/homepage');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));
app.use(express.static(__dirname + '/Views'));

app.get("/", async (req, res, next) => {
  await homePage.displayHomePage(res);
});

server.listen(port, function() {
  console.log("Server is running on Port: " + port);
});
