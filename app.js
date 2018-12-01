//Importing dependencies
var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user");
var cookieSession = require("cookie-session");
var routes_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
var formidable = require("express-formidable");
var http = require("http");
var mongoose = require("mongoose");
var ObjectID = require('mongodb').ObjectID;
var fs = require("fs");

var methodOverride = require("method-override");

var app = express();
var server = http.Server(app);

//Middleware built-in
//Retrieving of static files
app.use("/public", express.static("public"));
//Read Request Params for application/json requests
app.use(bodyParser.json());
//extended=false: we can't parse variables like arrays
//extended=true we can parse more kinds of objects
app.use(bodyParser.urlencoded({extended: true}));

//Same value as the action attribute of the form tag (HTML)
//For instance, edit.jade
app.use(methodOverride("_method"));

//Manage session through cookies
app.use(cookieSession({
  name: "session",
  keys: ["llave-1", "llave-2"]
}));

//Luar donde guardar los imagenes (carpeta temporal)
app.use(formidable.parse({ keepExtensions: true}));

app.set("view engine", "jade");

//Render views
//Main page
app.get("/", function(req, res) {
  //console.log(req.session.user_id);
  res.render("index");
});


//Signup  View
app.get("/signup", function(req, res) {
  //Find/Select user
  User.find(function(err, doc){
    res.render("signup");
  });
});

//Login  View
app.get("/login", function(req, res) {
    req.session = null
    res.render("login");
});

//Users  View
//SIGN UP POST
app.post("/users", function(req, res) {
  //res.json(req.body);
  var objectId_user = new ObjectID();
  console.log("req body EXTENSION: " + req.body.archivo);
  var extension = req.body.archivo.name.split(".").pop();

  var role = req.body.role;

  var user = new User({email:req.body.email, password: req.body.password,
    password_confirmation: req.body.password_confirmation,
    username: req.body.username, role: role,
    title_id:  objectId_user, extension: extension});
  console.log(user.password_confirmation);

  //Save with promises
  user.save().then(function(us){
    //res.send("Guardamos tus datos");
    fs.rename(req.body.archivo.path, "public/imagenes/"+user.title_id+"."+ extension, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    req.session.user_id = user._id;
    res.redirect("/app");
  }, function(err){
    console.log(String(err));
    //res.send("Hubo un error al guardar el usuario");
    res.redirect("/signup");
  })
});

//LOGIN POST
//Managing the case where the user hasn't been registered yet
app.post("/sessions", function(req, res){
  console.log("Login app: " + req.body.username )
  User.findOne({username :req.body.username, password:req.body.password}, function(err, user){
    if (user == null) {
      console.log("req.session: " + req.session)
      console.log("Login error: " + err);
      res.redirect("/login");
    }
    else {
      req.session.user_id = user._id;
      res.redirect("/app");
    }
  });
});

app.use("/app", session_middleware);
app.use("/app", routes_app);

//Server execution
server.listen(9001);
mongoose.connect("mongodb://localhost/appdb");
