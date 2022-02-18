// const e = require('express');
const express = require('express')
const router = express.Router();
const makdir = require('mkdirp')
// const fs = require('fs')
const fs = require('fs');
const resizeImg = require('resize-img')
//get product here
var Product = require('../modles/product');
var Category = require('../modles/category');
const { mkdirp } = require('fs-extra');
const { request } = require('http');
// const mkdir = require('mkdir');
// index page
router.get('/', function (req, res) {
  var count;
  Product.countDocuments(function (err, c) {
    count = c;     // difference b/w : and =
  });
  Product.find(function (err, products) {
    res.render('admin/product.ejs', {
      products: products,
      count: count
    })
  })

})
//get request
router.get('/addproduct', function (req, res) {
  const title = "";
  const desc = "";
  const video = "";
  const ingreadient="";
  // const image = "";
  
  Category.find(function (err, categories) {
    res.render('admin/addproduct', {
      title: title,
      desc: desc,
      ingreadient:ingreadient,
      categories: categories,
      video: video,
  
      // image:image,
    });
  })

})
//post request

router.post('/addproduct', function (req, res) {

  if(!req.files){ imagefile =""; }
  if(req.files){
  var imagefile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
  }
  // the typeof operator returns a string indicating the type of the unevaluated operand.
  // var imagefile = typeof (req.files && req.files.image) !== "undefined" ? req.files.image.name : ""; //The typeof operator returns a string indicating the type of the unevaluated operand.
  req.checkBody('title', 'title is required').notEmpty();
  req.checkBody('desc', 'description is required').notEmpty();
  req.checkBody('ingreadient', 'ingreadient is required').notEmpty();
  req.checkBody('video', 'video is required').notEmpty();
  
  req.checkBody('image', 'image is required').isImage(imagefile);

  const title = req.body.title;
  const slug = title.replace(/\s+/g,'-').toLowerCase(); //convert it to lowercase, and replace the spaces with hyphens
  const desc = req.body.desc;
  const ingreadient=req.body.ingreadient;
  const video = req.body.video;
  const category = req.body.category;

// console.log(title);
  const errors = req.validationErrors(); //Validation errors will be returned on error result objects when we can't process the API call because parameters are invalid.:
 
  if (errors) {
    Category.find(function (err, categories) {
      res.render('admin/addproduct', {
        errors: errors,
        title: title,
        desc: desc,
        ingreadient:ingreadient,
        categories: categories,
        video: video,
      
      });
    })
  } else {
    Product.findOne({ slug: slug }, function(err,products) {   //finding unique product
      if (products) {
        // console.log(products);
        req.flash('danger', 'page title exist choose another');
        Category.find(function (err, categories) {
          res.render('admin/addproduct', {
            errors: errors,
            title: title,
            desc: desc,
            ingreadient:ingreadient,
            categories: categories,
            video: video,
      
          });
        })
      } else {
        // var price2 = parseFloat(price).toFixed(1);
        var products = new Product({
          title: title,
          slug: slug,
          desc: desc,
          ingreadient:ingreadient,
          category:category,
          // categories: categories,
          video: video,
          image: imagefile,  
        })
        products.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            mkdirp('public/productimages/' + products.id, function (err) {
              return console.log(err);
            });
            mkdirp('public/productimages/' + products.id + '/gallery', function (err) {
              return console.log(err);
            });
            mkdirp('public/productimages/' + products.id + '/gallery/thumbs' , function (err) {
              return console.log(err);
            });
            if(imagefile!="")
            {
              var productimg=req.files.image;
              var path='public/productimages/'+products.id+'/'+imagefile;
              productimg.mv(path,function(err){  // function to move file to anywhere else in your server
                console.log(err);
              })
            }
            
            req.flash('success', 'product added');
            res.redirect('/adminpage/product');
          }
        });
      }
    })

  }
})
//  post request serialized
router.post('/record-pages', function (req, res) {
  // console.log(req.body);
  var ids = req.body['id[]']; // id coming in form of string
  var count = 0;
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    count++;
    (function (count) {
      Page.findById(id, function (err, page) {
        page.sorting = count;

        page.save((err) => {
          if (err)
            return console.log(err);
        });
      });
    })(count);
  }
});

//get request of edit
router.get('/productedit/:id', function (req, res) {   //:slud (because it dynamicallt changes) ex:_id etc
 var errors;
 if(req.session.errors) 
 errors=req.session.errors; //session is basically a middleware that is not visible at client side and creating the session, setting the session cookie and creating the session object in req object.
 //whenever there is a req from client side of same object we have info of thar person and add more property to it

 req.session.errors=null;  // initally at 0 
 
 Category.find(function (err, categories) {
  Product.findById(req.params.id,function(err,p){
    if(err){
      console.log(err);
      res.redirect('/admin/product');
    }else{
      var gallerydir='public/productimages/'+p.id+'/gallery';
      var galleryimg=null;
      fs.readdir(gallerydir,function(err,files){
        if(err)
        {
         console.log(err);
          // res.redirect('/admin/product');
        }else{
          galleryimg=files;
          res.render('admin/productedit', {
           id:p.id,
            errors: errors,
            title: p.title,
            desc: p.desc,
            ingreadient:p.ingreadient,
            categories: categories,
            category:p.category.replace(/\s+/g,'-').toLowerCase(), //working as a slug
            // price:parseFloat(p.price).toFixed(1),
            video:p.video,
       
            image:p.image,
            galleryimg:galleryimg,
          });
        }
      })
    }
  })
})
})

router.post('/productedit/:id', function (req, res) {

  if(!req.files){ imagefile =""; }
  if(req.files){
  var imagefile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
  }
 
  // var imagefile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
 
  // var imagefile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";
  req.checkBody('title', 'title is required').notEmpty();
  req.checkBody('desc', 'description is required').notEmpty();
  req.checkBody('ingreadient', 'ingreadient is required').notEmpty();
  req.checkBody('video', 'video is required').notEmpty();
  req.checkBody('image', 'image is required').isImage(imagefile);

  const title = req.body.title;
  const slug = title.replace(/\s+/g,'-').toLowerCase(); //convert it to lowercase, and replace the spaces with hyphens
  const desc = req.body.desc;
  const ingreadient=req.body.ingreadient;
  const video = req.body.video;
  const category = req.body.category;
  const pimage=req.body.pimage; 
  var id=req.params.id;  ///since this is coming from   router.post('/productedit/:id') so params not body
  var errors = req.validationErrors();
  if(errors){ // as we have decleared in session error
    console.log(errors);
    req.session.errors=errors;
    res.redirect('/adminpage/product/productedit/'+id);
  }else{
    Product.findOne({ slug: slug, id:{ '$ne': id } }, function (err, p) { // exclud from other page
     if(err)
     {
       console.log(err);
     }
    if (p) {
        req.flash('danger', 'product title already exist');
    res.redirect('/adminpage/product/productedit/'+id);    
    }
    else{
      Product.findById(id,function(err,p){
        if(err)
        {
          console.log(err);
        }
        p.title = title;
        p.slug = slug;
        p.desc = desc;
        p.ingreadient=ingreadient;
        p.video=video;
        p.category=category;
        if(imagefile!="")
        {
          p.image=imagefile;
        }
        p.save(function(err){
          if(err)
          {
            console.log(err);
          }
          if(imagefile!=""){
            if(pimage!=""){   //if pimage in not null then removing the current image and uploading new
             console.log(pimage);
              const path = 'public/productimages/'+id+'/'+pimage;
              try {
                fs.unlinkSync(path)
              } catch(err) {
                console.error(err)
              }
            
           
            }
            var productimg=req.files.image;
            var path='public/productimages/'+id+'/'+imagefile;
            productimg.mv(path,function(err){  // function to move file to anywhere else in your server
              return console.log(err);
          });
        }

        req.flash('success', 'product updated');
        res.redirect('/adminpage/product/productedit/'+id);  
      })
    })
  }
});
  }
});

// get gallery image
var fss = require('fs-extra')

router.post('/productgallery/:id', function (req, res) {   //:slud (because it dynamicallt changes) ex:_id etc
  var productimages=req.files.file;  //(where file is the the name of input of dropzone in  productedit.ejs)
  var id=req.params.id;
  var path='public/productimages/'+id+'/gallery/'+req.files.file.name;
  var thumbpath='public/productimages/'+id+'/gallery/thumbs/'+req.files.file.name;

  productimages.mv(path,function(err){  // function to move file to anywhere else in your server
              if(err){
                console.log(err);
              }
resizeImg(fs.readFileSync(path),{width:100,height:100}).then(function(buf){
    fs.writeFileSync(thumbpath,buf);
  });
          });

  res.sendStatus(200);
});

router.get('/deleatimage/:image', function (req, res) {   //:slud (because it dynamicallt changes) ex:_id etc
  var originalimage='public/productimages/'+req.query.id+'/gallery/'+req.params.image;  // query is udse when we want to use sumething from linke we have provided  like in <td><a class="conform" href="/adminpage/product/deletepro/<%=pro.id %>" >delete</a></td>
  var thumbimage='public/productimages/'+req.query.id+'/gallery/thumbs/'+req.params.image; //
 
  try{  fs.unlinkSync(originalimage)
 }catch(err) {
  console.error(err)
}
try {
  fs.unlinkSync(thumbimage)
} catch(err) {
  console.error(err)
}
req.flash('success', 'image deleted');
res.redirect('/adminpage/product/productedit/'+req.query.id);  
  
});

router.get('/deletepro/:id', function (req, res) {   //:slud (because it dynamicallt changes) ex:_id etc
  var id=req.params.id;
  var path='public/productimages/'+id;
  try {
    fs.unlinkSync(path)
  } catch(err) {
    console.error(err)
    Product.findByIdAndRemove(id, function (err) {
      console.log(err);
     });
  } 
  req.flash('success', 'page deleated');
  res.redirect('/adminpage/product');
  // fs.remove(path, (err) => {
  //   if (err) {
  //     console.error(err)
  //   }else{
  //     Product.findByIdAndRemove(id, function (err) {
  //        console.log(err);
  //       });
  //       req.flash('success', 'page deleated');
  //       res.redirect('/adminpage/product');
  //   }
  // })
})
//   fs.remove(path,function(err){
//     if(err){
//       console.log(err);
//     }else{
//       Product.findByIdAndRemove(id, function (err) {
//          console.log(err);
//         });
//         req.flash('success', 'page deleated');
//         res.redirect('/adminpage/product');
//     }
//   });
// });

module.exports = router;