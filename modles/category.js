const mongoose=require('mongoose');
const categorySchema=mongoose.Schema({
    title:{
type:String,
required:true
    },
    slug:{
type:String
    },
 
});
// we are using slud in place of id in this project because in url we get the title of page which held in serach optmizing engine.
const Category=module.exports=mongoose.model('Category',categorySchema);