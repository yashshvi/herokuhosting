// passpoer is use for verifying username and password authentication using facebook,insta,etc
// for more read this https://www.npmjs.com/package/passport
// bcrypt is for reducing time for seraching
// passport-local The local authentication strategy authenticates users using a username and password. 
var LocalStrategy=require('passport-local').Strategy;
var User=require('../modles/user');
var bcrypt=require('bcryptjs');
module.exports=function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        User.findOne({username:username},function(err,user){
            if(err){
                console.log(err);
            }
            if(!user){
                return done(null,false,{message:'no user found!'});
            }
            bcrypt.compare(password,user.password,function(err,ismatch){
                if(err){
                    console.log(err);
                }
                if(ismatch){
                    return done(null,user);
                }else{
                    return done(null,false,{message:'incorrect password!'});
                }

            })
        })
    }));
    // passport.serializerUser(function(user,done){
    //     done(null,user.id);
    // });

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    

    // passport.deserializerUser(function(id,done){
    //     User.findById(id,function(err,user){
    //         done(err,user);
    //     })
    // });

    passport.deserializeUser(function(id, done) {
        User.findById(id,function(err,user){
            done(err,user);
        })
    });

}