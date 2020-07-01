const route = require('express').Router();
//MODELS
const  PROMOTION_MODEL  = require('../models/promotion');
const  CART_MODEL  = require('../models/cart');
let PRODUCT_COLL = require('../database/product');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
const { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.get('/add-promotion' ,ROLE_ADMIN, async (req, res) => {
    renderToView(req, res, 'dashboards/pages/add-promotion', {})
})

route.post('/them-khuyen-mai', uploadMulter.single('avatar') ,async (req, res) => {
    let {title, content, percent ,status} = req.body;

    let infoFile                          = req.file;
    
    let infoProduct = await PROMOTION_MODEL.insert({title, content, percent ,avatar: infoFile.originalname ,status});
    if(infoProduct.error){
        return res.json(infoProduct);
    }
    res.json({infoProduct});
})

route.get('/danh-sach-khuyen-mai',ROLE_ADMIN, async (req,res) => {
    renderToView(req, res, 'dashboards/pages/list-promotion', {});
})








module.exports = route;