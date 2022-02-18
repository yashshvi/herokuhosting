const e = require('express');
const express = require('express')
const router = express.Router();
var auth=require('../config/auth')
var isUser=auth.isUser;
var Product = require('../modles/product');
var Category=require('../modles/category');

 var fs=require('fs-extra')
//  router.get('/get',isUser, function (req, res) {
router.get('/get', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
    console.log("komahvjhvkjb");
    Product.find(function (err, products) {
        console.log("komallll");
        if (err) {
            console.log(err);
        } 
        console.log("komallll");
        res.render('allproduct.ejs', {
                    title: 'all product',
                    products:products,
                });
    })
})

router.get('/:category', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
   var categoryslug=req.params.category;
   Category.findOne({slug:categoryslug},function (err, c) {
    Product.find({category:categoryslug},function(err,products){
        // console.log("komallll");
        if (err) {
            console.log(err);
        } 
        res.render('catproduct.ejs', {
                title: c.title,
                 products:products,
               });
            //    console.log("koma");
            })  
    })
})


// get product details
router.get('/:category/:product', function (req, res) {
   var galleryimage=null;
   var loggin=(req.isAuthenticated())?true:false;
   Product.findOne({slug:req.params.product},function(err,product){
       if(err)
       {
        console.log(err);
       }else{
        var gallerydir='public/productimages/'+ product.id +'/gallery';
        fs.readdir(gallerydir,function(err,files){
            if(err)
            {
                console.log(err);
            }else{
                galleryimage=files;
                res.render('product',{
                    title:product.title,
                    p:product,
                    galleryimage:galleryimage, 
                    loggin:loggin,
                })
            }
        })
       }
   })
})


module.exports = router;