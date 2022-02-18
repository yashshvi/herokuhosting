const e = require('express');
const express = require('express');
const { defaults } = require('slug');
const router = express.Router();
const Product = require('../modles/product');
const { checkout} = require('./products');
// ./products
//for adding a product
router.get('/add/:product', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
   var slug=req.params.product;
    Product.findOne({ slug:slug }, function (err, p) {
        if (err) {
            console.log(err);
        } 
            if(typeof req.session.cart == "undefined"){  // if cart is empty
                req.session.cart=[];
                req.session.cart.push({
                    title:slug,
                    qty:1,
                    price:parseFloat(p.price).toFixed(1),
                    image:'/productimages/'+p.id+'/'+p.image,

                });
            }else{
            var cart=req.session.cart;
            var newitm=true;
                for(var i=0;i<cart.length;i++)   // if same product is present then qty will incresae only
                {
                    if(cart[i].title == slug){
                        cart[i].qty++;
                        newitm=false;
                        break;
                    }
                }
                    if(newitm){
                        cart.push({
                            title:slug,
                            qty:1,
                            price:parseFloat(p.price).toFixed(1),
                            image:'/productimages/'+p.id+'/'+p.image,
                        });
                        
                    }
        }
        console.log(req.session.cart);        
        req.flash('success', 'product added');
        //   res.send("product added");
        res.redirect('back')
        // res.redirect('/products/get')

     
    })
})


router.get('/checkout', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
   if(req.session.cart && req.session.cart.length==0)
{
    delete req.session.cart;
    res.redirect('/cart/checkout');
}else{
    
    res.render('checkout',{
        title:'checkout',
        cart:req.session.cart,
    });
}
})

// inportant
// req.query will return a JS object after the query string is parsed.
// /user?name=tom&age=55 - req.query would yield {name:"tom", age: "55"}
// req.params will return parameters in the matched route. If your route is /user/:id and you make a request to /user/5 - req.params would yield {id: "5"}
router.get('/update/:product', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
    
  var slug=req.params.product;
  var cart=req.session.cart;
  var action=req.query.action;
  console.log(action);
  for(var i=0;i<cart.length;i++) 
  {
      if(cart[i].title == slug)
      {
        //   console.log(action);
          switch(action){
            case "add":
             cart[i].qty++;
            break;
            case "remove":
               cart[i].qty--;
               if(cart[i].qty<1)
               {
                cart.splice(i,1);  //array.splice(index, howmany, item1, ....., itemX)   
               }
               break;   
            case "clear":
                cart.splice(i,1);
             if(cart.length==0){
            delete req.session.cart;
                 break;}
            default:
               console.log('update problem');
                break;  
          }
          break;
      }
  }
  req.flash('success', 'product added');
  res.redirect('/cart/checkout');
});

router.get('/clean', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
 
     delete req.session.cart;
     res.redirect('/cart/checkout');

 })

 router.get('/buynow', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
 
    delete req.session.cart;
    // res.redirect('2000');
    res.sendStatus(200);

})
module.exports = router;