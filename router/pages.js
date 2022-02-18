const e = require('express');
const express = require('express')
const router = express.Router();
const Page = require('../modles/page')

router.get('/', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
    Page.findOne({ slug:"home" }, function (err, page) {
        if (err) {
            console.log(err);
        } 
        res.render('index.ejs', {
                    title: page.title,
                    content: page.content,
                });
    })
})
router.get('/:slug', function (req, res) { // here if i send /home then in index.js i have to pass ./router/pages/home
    var slug = req.params.slug;
    Page.findOne({ slug: slug }, function (err, page) {
        if (err) {
            console.log(err);
        } else {
            if (!page) {
                res.redirect('/');
            } else {
                res.render('index.ejs', {
                    title: page.title,
                    content: page.content,
                });
            }
        }
    })
})




module.exports = router;