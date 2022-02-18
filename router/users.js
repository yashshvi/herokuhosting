const e = require('express');
const express = require('express')
const router = express.Router();
var passport=require('passport');
var bcrypt=require('bcryptjs');
const User = require('../modles/user');
// const { render } = require('ejs');

router.get('/register', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
  res.render('register',{
title:'register',
  })
})

router.post('/register', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
var name = req.body.name;
    const email = req.body.email;
   const username = req.body.username;
   const password = req.body.password;
    const password2 = req.body.password2;

    console.log( name);
    console.log(email);
    console.log(password);
    // req.checkBody(' nameid ', 'name is required').isEmail();
  req.checkBody('email', 'email is required').isEmail();
  req.checkBody('username', 'username is required').notEmpty();
  
  req.checkBody('password', 'password is required').notEmpty();
  req.checkBody('password2', 'password does not match!').equals(password);
const errors = req.validationErrors();
// console.log(errors);

  if(errors)
  {
      res.render('register',{
         errors:errors,
         title:'register', 
      });
   

  }else{
    
User.findOne({username:username},function(err,user){
    if(err){
        console.log(err);
    }
    if(user){
        req.flash('danger', 'username already exist');
        res.redirect('/users/register');

        // res.render('/users/register', { message: req.flash('user already exist') });

    }else{
        var user=new User({
            name:name,
            email:email,
            username:username,
            password:password,
            admin:0,
        });
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err){
                    console.log(err);
                }
                user.password=hash;
                user.save(function(err){
                    if(err)
                    {
                        console.log(err);
                    }else{
                        req.flash('success', 'register successfully');
                        res.redirect('/');


                       

                    }
                })
            })
        })
    }
})
  }
  })

  router.get('/login', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
   if(res.locals.user)  //if the user exist
   res.redirect('/');
    res.render('login',{
  title:'login',
    });
  });



  router.post('/login', function (req, res,next) {
  passport.authenticate('local',{
      successRedirect:'/',
      failureRedirect:'/users/login',
      failureFlash:true, 
  })(req,res,next);
   });
   

   router.get('/logout', function(req, res){
    req.logout();
    req.flash("logout successfully")
    res.redirect('/users/login');
  });
//    router.post("/login", passport.authenticate("local", 
//   { successRedirect: "/", 
//     failureRedirect: "/users/login", 
//     failureMessage: "Invalid username or password" }));

module.exports = router;