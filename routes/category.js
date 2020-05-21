const route = require('express').Router();
//MODELS
const  CATEGORY_MODEL  = require('../models/category');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.post('/them-danh-muc', async (req, res) => {
    let {title, description} = req.body;
    console.log({title, description});
    
    let infoCategory = await CATEGORY_MODEL.insert(title, description);
    console.log(infoCategory);
    
    res.json({infoCategory});
})

module.exports = route;