const express=require('express')
const path=require('path');
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator=require('express-validator')
const fileUpload=require('express-fileupload')
const passport=require('passport');
const flash = require('connect-flash')
const config=require('./config/database');
const mongoose = require('mongoose');
mongoose.connect(config.data, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we are connected ");
});
const app =express();
// app.use(flash());
// view engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

// set public folder
app.use(express.static(path.join(__dirname,'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// set console.error( locals);
app.locals.errors=null; 

var Page=require('./modles/page');
Page.find({}).sort({sorting:1}).exec(function(err,pages){  //sorting 1 meand ascending
 if(err)
 {
   console.log(err);
 }else{
 app.locals.pages=pages;
 }
})

// categories
var Category=require('./modles/category');
Category.find({}).sort({sorting:1}).exec(function(err,categories){  //sorting 1 meand ascending
 if(err)
 {
   console.log(err);
 }else{
 app.locals.categories=categories;
 }
})

// file upload
app.use(fileUpload());

// parse application/json
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

  //validator2.Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }    return {
        param : formParam,
        msg   : msg,
        value : value
      };
    },
    customValidators:{
      isImage:function(value,filename){
        var extension=(path.extname(filename)).toLowerCase();  //return the extension of file
        switch(extension){
          case'.jpg':
          return '.jpg';
          case'.jpeg':
          return '.jpeg';
          case'.png':
          return '.png';
          case'':
          return '.jpg';
          default:
            return false;

         }
      }
    }
  }));
  
  //express validator   // available everywhere
  // the flash is a special area of the session used for storing messages. Messages are written to the flash and cleared after being displayed to the user. 
  app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(require('connect-flash')());
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); 

// app.use(function (req, res, next) 
// { res.locals.messages = require('express-messages') (req , res); next(); });

// // in order to create a shopping cart we need a simple storage system where we can 
// collect products and the cart's total. Node. js provides us with the express-session package,
//  a middleware for ExpressJS. By default this package stores session data in memory 
// but this is not recommended in a production environment.


app.get('*',function (req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user=req.user || null ;   //if a user logged in in we will access it otherwwise null
   next();
});

//router
const pages=require('./router/pages');
const products=require('./router/products');
const adminpages=require('./router/adminpage');

const admincategory=require('./router/admincategory');
const adminproduct=require('./router/adminproduct');
const cart=require('./router/cart');
const users=require('./router/users');

app.use('/cart',cart);
app.use('/users',users);
app.use('/',pages);
app.use('/products',products);
app.use('/admincat/category',admincategory);
app.use('/adminpage/pages',adminpages);
app.use('/adminpage/product',adminproduct);
const port=8000;
app.listen(port,function(){
    console.log('listening to port'+port);
});
