const path = require('path');
const express = require('express');
const Cookies = require('cookies');
const db = require('../models');
const Sequelize = require('sequelize')

const router = express.Router();

router.get('/',(req, res, next) => {
    // console.log("sessionis:", req.session.id);

    if(req.session.usedEmail){
        console.log("in usedEmail");
        res.render('register', {
            pageTitle: 'Register',
            wrongEmail: req.session.data.email,
            timeExpired: false,
            path: '/register',
        });
    }
    else if(req.session.timeExpired) {
        console.log("in time expired");
        res.render('register', {
            pageTitle: 'Register',
            wrongEmail: '',
            timeExpired: true,
            path: '/register',
        });
    }
    else{
        // console.log("starting");
         req.session.timeExpired = false;
         req.session.usedEmail = false;
        // console.log("session id after starting", req.session.id);

        res.render('register', {
                pageTitle: 'Register',
                wrongEmail: '',
                timeExpired: false,
                path: '/register',
            });
        }
    });

router.post('/', (req, res, next) => {
    // console.log("session id in post register:", req.session.id);

    req.session.data = req.body;

    console.log("session.data: ", req.session.data);

    db.Emails.findAll({where: {email: req.session.data.email}, attributes:['email']})
        .then((email) => {
            if(email.length > 0){
                console.log("email exists: ", email);
                req.session.usedEmail = true;
                res.redirect("/register");}
            else {
                console.log("email does not exists");
                var newCookie = new Cookies(req, res);
                newCookie.set('time', Date.now().toString());

                console.log("redirecting to password page")
                res.redirect('/register/password/');
            }
        }).catch((err) => {
            console.log('There was an error querying the email: ', err)
            return res.send(err)
        });

    // console.log("after \"find all\"")
});

router.get('/password', (req, res, next) => {
    res.render('password', {
        pageTitle: 'Password',
        path: '/register/password',
    });
});


router.post('/password', (req, res, next) => {

    var newCookie = new Cookies(req, res);
    var elapesdTime  = newCookie.get('time');
    if(!elapesdTime){
        console.log("error, dosn't have a cookie");
        return  res.status(400).send("error, dosn't have a cookie(?)");

    }
    elapesdTime = parseInt(elapesdTime);

    // console.log("sessionid in post password:", req.session.id);
        console.log("has cookie, time: "+ elapesdTime +"  Date.now(): " + Date.now());

        if(elapesdTime +60*1000 < Date.now()){
            req.session.timeExpired = true;
            res.redirect('/register');
        }
        else{
            const details = {   firstName:req.session.data.first,
                                lastName:req.session.data.last,
                                email:req.session.data.email,
                                password: req.body.password1,
            };
            console.log("good time, saving: ", details);
            return db.Emails.create(details)
            .then((user) => {console.log("added:"); res.end();})
            .catch((err) => {
                if(err instanceof  Sequelize.UniqueConstraintError){
                    console.log('***is the email already used?');
                    req.session.usedEmail = true;
                    res.redirect("/register");
                }
                else {
                    console.log('***There was an error creating this user', JSON.stringify(err));
                    return res.status(400).send(err);

                }
            })
        }

    });

module.exports = router;
