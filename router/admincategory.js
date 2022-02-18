// const e = require('express');
const express=require('express')
const router=express.Router();
//get modles here
var Category=require('../modles/category');
// var Pages=require("../modles/page");
// index page
router.get('/',function(req,res){
//   res.send("category  area")
Category.find(function(err,categories){
    if(err)
    {
        console.log(err);
    }else{
        res.render('admin/categories.ejs',{
          //changing 
          categories:categories,
         
         });
    }
})
})

//get request
router.get('/addcat',function(req,res){
 var title="";
 
//  Pages.find(function(err,Navcatagory){
//    res.render('admin/addcategory',{
//     title:title,
//     Navcatagory:Navcatagory
//    })
//  })
  res.render('admin/addcategory',{
  title:title,
 
 });

})

//post request
router.post('/addcat',function(req,res){
req.checkBody('title','title is required').notEmpty();
// req.checkBody('Navcatagory','Navcatagory is required').notEmpty();
const title=req.body.title;

var slug=title.replace(/\s+/g,'-').toLowerCase();
// const Navcatagory=req.body.Navcatagory;
const errors=req.validationErrors();
// const errors="";

if(errors){
  // Pages.find(function(errors,Navcatagory){
  //     res.render('admin/addcategory',{
  //       errors: errors,
  //       title: title,
  //       Navcatagory:Navcatagory
  //     })
  // })
  console.log("error");
  res.render('admin/addcategory',{
    errors:errors,
    title:title,
    // Navcatagory,Navcatagory
   });
}else{
    Category.findOne({slug:slug},function(err,categories){
    if(categories){
      req.flash('danger','category already exist');
    //  Pages.find(function(err,Navcatagory){
    //    res.render('admin/addcategory',{
    //     errors: errors,
    //     title: title,
    //     Navcatagory:Navcatagory
    //    })
    //  })
     
     
      res.render('admin/addcategory',{
        title:title,
        // Navcatagory:Navcatagory
       });
    }else{
      var categories=new Category({
        title:title,
        // Navcatagory:Navcatagory,
        slug:slug,
       // sorting is editable sorting 0 means descending
      })
      categories.save(function(err){
        if(err)
      {
        console.log(err);
      }else{
        Category.find({}).sort({sorting:1}).exec(function(err,categories){  //sorting 1 meand ascending
          if(err)
          {
            console.log(err);
          }else{
          req.app.locals.categories=categories;
          }
         })
        req.flash('success','category added');
res.redirect('/admincat/category');
      }
      });
    }
  })
  
}  
 })
//  post request serialized
// router.post('/record-pages',function(req,res){
//   // console.log(req.body);
//   var ids=req.body['id[]']; // id coming in form of string
//   var count=0;
//   for(var i=0;i<ids.length;i++)
//   {
//     var id=ids[i];
//     count++;
//     (function(count){
//       Page.findById(id,function(err,page){
//         page.sorting=count;
      
//         page.save((err)=>{
//           if(err)
//          return  console.log(err);
//         });       
//       });
//     })(count);
//   }
// });

//get request of edit
router.get('/editcat/:id',function(req,res){   //:slud (because it dynamicallt changes) ex:_id etc
  Category.findById(req.params.id,function(err,categories){
   if(err)
   return console.log(err);
  res.render('admin/editcat',{
    title:categories.title,
    id:categories.id,
   });
 })
 })

 router.post('/editcat/:id',function(req,res){
  req.checkBody('title','title is required').notEmpty();
  const title=req.body.title;
  var slug=title.replace(/\s+/g,'-').toLowerCase();
 
  var id=req.params.id;
  const errors=req.validationErrors();

  if(errors){
    console.log("error");
    res.render('admin/editcat',{
      errors:errors,
      title:title,
      id:id,
     });
  }else{  
    Category.findOne({slug:slug,id:{'$ne':id}},function(err,categories){ // exclud from other page
      if(categories){
     console.log(id);
        req.flash('danger','category already exist');
        res.render('admin/editcat',{
          title:title,
          // slug:slug,
          id:id,
         });
      }else{
        Category.findById(id,function(err,categories){
          if(err)
          return console.log(err);
          categories.title=title,
          categories.slug=slug,
          categories.save(function(err){
            if(err)
            return console.log(err);
            Category.find({}).sort({sorting:1}).exec(function(err,categories){  //sorting 1 meand ascending
              if(err)
              {
                console.log(err);
              }else{
              req.app.locals.categories=categories;
              }
             })
            req.flash('success','page updated');
            res.redirect('/admincat/category/editcat/'+ id);
          })
        })
        // page.save(function(err){
        //   if(err)
        // { console.log(err);
        // }else{
        //   req.flash('success','page added');
        //   res.redirect('/adminpage/pages');
        // }
        // });
      }
    })
    }  
   })

   router.get('/deletecat/:id',function(req,res){   //:slud (because it dynamicallt changes) ex:_id etc
    Category.findByIdAndRemove( req.params.id,function(err){
      if(err)
      return console.log(err);
      Category.find({}).sort({sorting:1}).exec(function(err,categories){  //sorting 1 meand ascending
        if(err)
        {
          console.log(err);
        }else{
        req.app.locals.categories=categories;
        }
       })
      req.flash('success','page deleated');
      res.redirect('/admincat/category');
   
    })
    })

module.exports=router;