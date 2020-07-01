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

route.get('/',ROLE_ADMIN , async (req, res) => {

    renderToView(req, res, 'dashboards/pages/dashboard', {})

})






module.exports = route;