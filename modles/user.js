const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
  
  email:{
type:String,
required:true,
    },username:{
type:String,
required:true
    },
    password:{
type:String
    },   admin:{
        type:Number,
            },
});
// we are using slud in place of id in this project because in url we get the title of page which held in serach optmizing engine.
const User=module.exports=mongoose.model('User',userSchema);