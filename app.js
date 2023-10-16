const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://admin-varsha:varsha123@cluster0.oyyo7nr.mongodb.net/glugot");
const schema=new mongoose.Schema({
  email:String,
  password:String
});
var secret = "thisisforultimatestar";
schema.plugin(encrypt, { secret: secret, encryptedFields:["password"] });
const association=new mongoose.model("association",schema);
app.get("/",function(req,res){
res.render("home");
});
app.get("/login",function(req,res){
  res.render("login");
})
app.post("/login",function(req,res){
const username=req.body.username;
const password=req.body.password;
association.findOne({email:username},function(err,user){
if(err){
  console.log(err);
}
else{
  if(user){
    if(user.password==password){
      res.render("main");
    }
    else{
      res.render("wrong");
    }
  }
  else{
    res.render("wrong");
  }
}
});
});
app.get("/register",function(req,res){
res.render("register");
});
app.post("/register",function(req,res){
  const user=new association({
    email:req.body.username,
    password:req.body.password
  });
  user.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("main");
    }
  });
});
app.get('/usersList', function(req, res) {
  association.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);  
  });
});

app.get("/submit",function(req,res){
res.render("submit");
});
app.get("/logout",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT||3000,function(){
console.log("connected");
});
