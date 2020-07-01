const route = require('express').Router();
//MODELS
const  PRODUCT_MODEL  = require('../models/product');
const  CART_MODEL  = require('../models/cart');
const  TAG_MODEL  = require('../models/tag');
let PRODUCT_COLL = require('../database/product');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.post('/them-tag', async (req, res) => {
    let {title , products} = req.body;
    console.log({title , products});
    
    let infoTag = await TAG_MODEL.insert(title , products);
    console.log(infoTag);

    if(infoTag.error){
        return res.json(infoTag);
    }
    res.json({infoTag});
})

route.get('/danh-sach-san-pham', async (req,res) => {
    let checkQuery = req.query;
    let listProduct;
    if(!checkQuery){
        listProduct = await PRODUCT_MODEL.listProductAllCategories();
    }else{
        listProduct = await PRODUCT_MODEL.getListProductOneCategory(checkQuery);
    }
    res.json({listProduct});
})


module.exports = route;