const route = require('express').Router();
//MODELS
const  PRODUCT_MODEL  = require('../models/product');
const  CART_MODEL  = require('../models/cart');
const  USER_MODEL  = require('../models/user');
let PRODUCT_COLL = require('../database/product');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.get('/login', async (req, res) => {
    renderToView(req, res, 'dashboards/pages/login', {})
})

route.post('/login', async (req, res) => {
    let {username, password} = req.body;
    // console.log({username, password})

    let infoUser = await USER_MODEL.signIn(username, password);
    // console.log({infoUser})
    if (infoUser.error){
        return res.json(infoUser)
    }

    req.session.token = infoUser.data.token;
    req.session.user = infoUser.data;
    res.json({infoUser});
})

route.get('/log-out', async (req, res) => {
    req.session.token = undefined;
    res.redirect('/users/login');
})




module.exports = route;