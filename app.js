var express               = require("express"),
    mongoose              =require("mongoose"),
    passport              =require("passport"),
    LocalStrategy         =require("passport-local"),
    bodyParser            =require("body-parser"),
    User                  =require("./models/user"),
    passportLocalMongoose =require("passport-local-mongoose")

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://admin:punwun1810@ds237770.mlab.com:37770/culper")


app.use(require("express-session")({
    secret:"suh",
    resave: false,
    saveUninitialized:false

}));

app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:true}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser =req.user;
  next();
});



app.get("/",function(req,res){
  res.render("index");
});

app.get('/contact',function(req,res){
  res.render('contact');
});

app.get('/news',function(req,res){
  res.render('news');
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});
//login routes
app.get("/login",alreadyLoggedIn,function(req,res){
  res.render("log");
});

app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
})
 ,function(req,res){

});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function alreadyLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect("/");
  }
  return next();
}

app.get('/calendar',function(req,res){
  if(req.isAuthenticated()){
  res.render("calendar");
  }
  else{
    res.redirect('/login');
  }
});

//CONOPS
app.get('/conops',function(req,res){
  if(req.isAuthenticated()){
    res.render('conops');
}else{
  res.redirect('/login');
}
});

app.get("/conops/:month",function(req,res){
  if(req.isAuthenticated()){
      if(req.params.month=='september'){
        res.render('./months/september');
      }
  if(req.params.month=='october'){
        res.render('./months/october');
      }
  if(req.params.month=='november'){
        res.render('./months/november');
      }
  if(req.params.month=='december'){
        res.render('./months/december');
      }
  if(req.params.month=='january'){
        res.render('./months/january');
      }
  if(req.params.month=='february'){
        res.render('./months/february');
      }
  if(req.params.month=='march'){
        res.render('./months/march');
      }
  if(req.params.month=='april'){
        res.render('./months/april');
      }
  if(req.params.month=='may'){
        res.render('./months/may');
      }
}else{
  res.redirect("/login");
}
});



app.get("/roster",function(req,res){
  if(req.isAuthenticated()){
  res.render('roster');
}
  else{
    res.redirect('/login');
  }
});

app.get('/about',function(req,res){
  res.render('about');
});

app.get("/cadet/:id",function(req,res){
  if(req.isAuthenticated()){
      User.findById(req.params.id,function(err,cadetUser){
      if(err){
        console.log(err);
      }else{
        res.render("controlPanel",{cadetUser:cadetUser});
      }
  });
}
else{
  res.redirect('/login');
}
});



//Register
app.get("/register",function(req,res){
  res.render("register2");
});

app.post("/register",function(req,res){
    User.register(new User (
      {
      username:req.body.username,
      first:req.body.first,
      last:req.body.last,
      email:req.body.email,
      school:req.body.school
      }
  ), req.body.password,function(err,user){
      if(err){
        console.log(err);
        return res.render("register");
      }else{
        passport.authenticate("local")(req,res,function(){
          res.redirect("/");
        });
      }

    });
});



var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});
