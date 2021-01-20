const path = require('path');
const express = require('express');
// const Cookies = require('cookies');
const db = require('../models');
const Sequelize = require('sequelize')

const router = express.Router();

router.post('/add',function (req, res, next) {
    console.log("api/add route, adding: ", req.body);

    const location = {
        user:req.session.userId,
        address:req.body.address,
        lon:req.body.longitude,
        lat:req.body.latitude
    }

    db.Locations.create(location)
        .then((loc) => {console.log("added: ");
        // res.end();
            res.redirect('/login/locations');

        }).catch(function (err) {
        console.log('***There was an error adding this location', JSON.stringify(err));
        return res.status(400).send(err);
    })
});



router.post('/locations_list', (req, res, next)=>{
    console.log("in get locations_list, req.body:", req.body);

    db.Locations.findAll({where:{user:req.body.userId}, attributes:['address', 'lon', 'lat'], raw:true})
    // db.Locations.findAll({where:{userId:req.session.userId}, attributes:['address', 'lon', 'lat'], raw:true})
        .then((list)=>{
            console.log('list: ', list);
            res.send(list);})
        .catch((err)=>{
            console.log('There was an error getting the list of addresses: ', err);
            err.error = 1;
            return res.send(err)
        })

});

module.exports = router;
