const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    title:{
type:String,
required:true
    },
    slug:{
type:String
    },
    desc:{
        type:String,
        required:true,
            },
  ingreadient:{
                type:String,
                required:true
    },
            category:{
type:String,
required:true
    },
    video:{
type:String,
required:true
    },
    image:{
        type:String
    }
});
// we are using slud in place of id in this project because in url we get the title of page which held in serach optmizing engine.
const Product=module.exports=mongoose.model('Product',productSchema);
// price