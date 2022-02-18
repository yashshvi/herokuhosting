// const e = require('express');
const express=require('express')
const router=express.Router();
//get modles here
var Page=require('../modles/page');
var auth=require('../config/auth')
var isadmin=auth.isadmin;
// index page
router.get('/',isadmin,function(req,res){
  //res.send("admin area")
  Page.find({}).sort({sorting:1}).exec(function(err,pages){  //sorting 1 meand ascending
    res.render('admin/page',{
      pages:pages,
    })
  })
})
//get request
router.get('/addpage',function(req,res){
 const title="";
 const slug="";
 const content="";
 
 res.render('admin/addpage',{
  title:title,
  slug:slug,
  content:content,
 });
 
})
//post request

router.post('/addpage',function(req,res){
req.checkBody('title','title is required').notEmpty();
req.checkBody('content','content is required').notEmpty();

const title=req.body.title;
var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
if(slug == "") slug=title.replace(/\s+/g,'-').toLowerCase();
const content=req.body.content;
const errors=req.validationErrors();
if(errors){
  console.log("error");
  res.render('admin/addpage',{
    errors:errors,
    title:title,
    slug:slug,
    content:content,
   });
}else{
  Page.findOne({slug:slug},function(err,page){
    if(page){
      req.flash('danger','page already exist');
      res.render('admin/addpage',{
        title:title,
        slug:slug,
        content:content,
       });
    }else{
      var page=new Page({
        title:title,
        slug:slug,
        content:content,
        sorting:100,  // sorting is editable sorting 0 means descending
      })
      page.save(function(err){
        if(err)
      {
        console.log(err);
      }else{

        Page.find({}).sort({sorting:1}).exec(function(err,pages){  //sorting 1 meand ascending
          if(err)
          {
            console.log(err);
          }else{
         req.app.locals.pages=pages;
          }
         })

        req.flash('success','page added');
res.redirect('/adminpage/pages');
      }
      });
    }
  })
  
}  
 })
//  post request serialized
function sortpage(ids,Callback){
  var count=0;
  for(var i=0;i<ids.length;i++)
  {
    var id=ids[i];
    count++;
    (function(count){
      Page.findById(id,function(err,page){
        page.sorting=count;
        page.save((err)=>{
          if(err)
         return  console.log(err);
         ++count;
         if(count>ids.length)
         {
           Callback();
         }
        });       
      });
    })(count);
  }
}

router.post('/record-pages',function(req,res){
  var ids=req.body['id[]'];
  sortpage(ids,function(){
    Page.find({}).sort({sorting:1}).exec(function(err,pages){  //sorting 1 meand ascending
      if(err)
      {
        console.log(err);
      }else{
     req.app.locals.pages=pages;
      }
     })
  })
  });
  // console.log(req.body);
  // var ids=req.body['id[]']; // id coming in form of string
  // var count=0;
  // for(var i=0;i<ids.length;i++)
  // {
  //   var id=ids[i];
  //   count++;
  //   (function(count){
  //     Page.findById(id,function(err,page){
  //       page.sorting=count;
      
  //       page.save((err)=>{
  //         if(err)
  //        return  console.log(err);
  //       });       
  //     });
  //   })(count);
  // }



//get request of edit
router.get('/edit/:id',isadmin,function(req,res){   //:slud (because it dynamicallt changes) ex:_id etc
 Page.findById(req.params.id,function(err,page){
   if(err)
   return console.log(err);
  res.render('admin/edit',{
    title:page.title,
    slug:page.slug,
    content:page.content,
    id:page.id,
   });
 })
 })

 router.post('/edit/:id',function(req,res){
  req.checkBody('title','title is required').notEmpty();
  req.checkBody('content','content is required').notEmpty();
  
  const title=req.body.title;
  var slug=req.body.slug.replace(/\s+/g,'-').toLowerCase();
  if(slug == "") slug=title.replace(/\s+/g,'-').toLowerCase();
  const content=req.body.content;
  var id=req.params.id;
  const errors=req.validationErrors();

  if(errors){
    console.log("error");
    res.render('admin/edit',{
      errors:errors,
      title:title,
      slug:slug,
      content:content,
      id:id,
     });
  }else{ 
    Page.findOne({slug:slug,id:{'$ne':id}},function(err,page){ // exclud from other page
      if(page){
     console.log(id);
        req.flash('danger','page already exist');
        res.render('admin/edit',{
          title:title,
          slug:slug,
          content:content,
          id:id,
         });
      }else{
        Page.findById(id,function(err,page){
          if(err)
          return console.log(err);
          page.title=title,
          page.slug=slug,
          page.content=content,
          page.save(function(err){
            if(err)
            return console.log(err);
            Page.find({}).sort({sorting:1}).exec(function(err,pages){  //sorting 1 meand ascending
              if(err)
              {
                console.log(err);
              }else{
             req.app.locals.pages=pages;
              }
             })
            req.flash('success','page updated');
            res.redirect('/adminpage/pages/edit/'+id);
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

   router.get('/delete/:id',isadmin,function(req,res){   //:slud (because it dynamicallt changes) ex:_id etc
    Page.findByIdAndRemove( req.params.id,function(err){
      if(err)
      return console.log(err);
      Page.find({}).sort({sorting:1}).exec(function(err,pages){  //sorting 1 meand ascending
        if(err)
        {
          console.log(err);
        }else{
       req.app.locals.pages=pages;
        }
       })
      req.flash('success','page deleated');
      res.redirect('/adminpage/pages/');
     
      });
    })
    // })

module.exports=router;