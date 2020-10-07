const route = require('express').Router();
//MODELS
const  CATEGORY_MODEL  = require('../models/category');
const  PRODUCT_MODEL  = require('../models/product');
const  PROMOTION_MODEL  = require('../models/promotion');
const  USER_MODEL  = require('../models/user');
const  ORDER_MODEL  = require('../models/order');
const  CART_MODEL  = require('../models/cart');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const jwt               = require('../utils/jwt');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.get('/list',async (req, res) => {
    renderToView(req,res, 'dashboards/pages/list-order',{  });
})

route.get('/list-products-popular',async (req, res) => {
    let listOrderWithPrice = await ORDER_MODEL.getListWithPrice();
    console.log({listOrderWithPrice});
    res.json({listOrderWithPrice})
})




module.exports = route;