exports.isUser=function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        // req.flash('danger',"please login");
        // res.redirect('/users/login');
        next();
    }
}
exports.isadmin=function(req,res,next){
    if(req.isAuthenticated() && res.locals.user.admin==1){
        next();
    }else{
        // req.flash('danger',"please login as admin");
        // res.redirect('/users/login');
        next();
    }
}