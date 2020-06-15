const route = require('express').Router();
//MODELS
const  CATEGORY_MODEL  = require('../models/category');
const  PRODUCT_MODEL  = require('../models/product');
const  USER_MODEL  = require('../models/user');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.get('/',async (req, res) => {
    
    renderToView(req,res, 'pages/customer',{  });
})

route.get('/dang-ky', async (req, res) => {

    renderToView(req, res, 'pages/sign-up',{})
})

route.post('/dang-ky', async (req, res) => {
    let {username, name, password} = req.body;
    //console.log({username, name, password});

    let infoUser = await USER_MODEL.insert(username, name, password);
    console.log({infoUser});
    
    res.json({infoUser});
})

route.get('/dang-nhap', async (req, res) => {

    renderToView(req, res, 'pages/sign-in',{})
})

route.post('/dang-nhap', async (req, res) => {
    let { username, password } = req.body;
    
    let infoUser = await USER_MODEL.signIn(username, password);
    
    req.session.token = infoUser.data.token; //gán token đã tạo cho session
    req.session.user = infoUser.data; 
    renderToView(req, res, 'pages/sign-in',{infoUser: infoUser.data })
})

route.get('/danh-sach-san-pham', async (req, res) => {
    let {id, productID} = req.query;
    let infoCategory = await CATEGORY_MODEL.getInfo(id);
    let infoProduct = await PRODUCT_MODEL.getInfo(productID);
    renderToView(req, res,'pages/shop', {infoCategory: infoCategory.data , infoProduct: infoProduct.data})
})

route.get('/tim-kiem', async (req, res) => {
        let { search } = req.query;
        console.log( search );
        console.log( "=====================" );
        let dataSearch = await PRODUCT_MODEL.search(search);
        console.log({ dataSearch })
        res.json({ data: dataSearch });
});

route.get('/chi-tiet-san-pham', async (req,res) => {
    let {productID} = req.query;

    let infoProduct = await PRODUCT_MODEL.getInfo(productID);
    
    let {id} = infoProduct.data.category;
    let infoCategory = await CATEGORY_MODEL.getInfo(id);
    
    renderToView(req, res, 'pages/product-detail',{infoProduct: infoProduct.data, infoCategory: infoCategory.data})
})

route.get('/cart',async (req, res) => {
    renderToView(req, res, 'pages/cart', {})
})




module.exports = route;