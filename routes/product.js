const route = require('express').Router();
//MODELS
const  PRODUCT_MODEL  = require('../models/product');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.post('/them-san-pham', async (req, res) => {
    let {title, description, price, salePrice ,avatar, gallery, category} = req.body;
    console.log({title, description, price, salePrice ,avatar, gallery, category});
    
    let infoProduct = await PRODUCT_MODEL.insert(title, description, price, salePrice ,avatar, gallery, category);
    console.log(infoProduct);
    
    res.json({infoProduct});
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

route.get('/danh-sach-san-pham/danh-muc', async (req,res) => {
    let {id} = req.query;
    
})


module.exports = route;