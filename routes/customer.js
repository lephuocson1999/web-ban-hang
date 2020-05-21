const route = require('express').Router();
//MODELS
const  CATEGORY_MODEL  = require('../models/category');
const  PRODUCT_MODEL  = require('../models/product');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.get('/',async (req, res) => {
    
    renderToView(req,res, 'pages/customer',{ });
})

route.get('/danh-sach-san-pham', async (req, res) => {
    let {id,productID} = req.query;
    console.log({id, productID});

    let infoCategory = await CATEGORY_MODEL.getInfo(id);
    let infoProduct = await PRODUCT_MODEL.getInfo(productID);
    console.log({ infoCategory, infoProduct });
    renderToView(req, res,'pages/shop', { infoCategory: infoCategory.data ,infoProduct: infoProduct.data})
})

route.get('/tim-kiem', async (req, res) => {
        let { search } = req.query;
        console.log( search );
        console.log( "=====================" );
        let dataSearch = await PRODUCT_MODEL.search(search);
        console.log({ dataSearch })
        res.json({ data: dataSearch });
});

route.get('/danh-sach-san-pham/danh-muc', async (req,res) => {
    //let {id} = req.query;
    
})




module.exports = route;