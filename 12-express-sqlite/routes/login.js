const path = require('path');
const express = require('express');
// const Cookies = require('cookies');
const db = require('../models');
const Sequelize = require('sequelize')

const router = express.Router();

router.get('/',function (req, res, next) {
    // console.log("login route");
    res.render('login', {
        pageTitle: 'Login',
        noUser: '',
        path: '/login',
    });
});


router.post('/',function (req, res, next) {
    console.log("post login route");

    db.Emails.findOne({where:{email:req.body.email, password:req.body.password}, attributes:['id','firstName', 'lastName'], raw : true})
        .then((user)=>{
            console.log("user: ", user, );
            if(user){
                req.session.name = user.firstName +' '+ user.lastName;
                req.session.userId = user.id;
                res.redirect('/login/locations');
            }
            else{
                res.render('login', {
                    pageTitle: 'Login',
                    noUser: req.body.email,
                    path: '/login',
                });
            }
        })
        .catch((err) => {
            console.log('There was an error getting your user from db. ', err)
            return res.send(err);
        });

});

router.get('/locations',function (req, res, next) {
    if(req.session.name){
    res.render('locations', {
            pageTitle: 'Locations',
            userName: req.session.name,
            path: '/login/locations',
            });
        }
    else //no session, he is not connected
        res.redirect('/login');
});



module.exports = router;
