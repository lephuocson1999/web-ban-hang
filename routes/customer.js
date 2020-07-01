const route = require('express').Router();
//MODELS
const  CATEGORY_MODEL  = require('../models/category');
const  PRODUCT_MODEL  = require('../models/product');
const  PROMOTION_MODEL  = require('../models/promotion');
const  USER_MODEL  = require('../models/user');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const jwt               = require('../utils/jwt');
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
    if(infoUser.error){
        return res.json(infoUser)
    }
    
    res.json({infoUser: infoUser.data});
})

route.get('/dang-nhap', async (req, res) => {

    renderToView(req, res, 'pages/sign-in',{})
})

route.post('/dang-nhap', async (req, res) => {
    let { username, password } = req.body;
    
    let infoUser = await USER_MODEL.signIn(username, password);
    
    if(infoUser.error){
        return res.json(infoUser);
    }

    req.session.token = infoUser.data.token; //gán token đã tạo cho session
    req.session.user = infoUser.data; 
    res.json({infoUser})
    // renderToView(req, res, 'pages/sign-in',{ })
})

route.get('/danh-sach-san-pham', async (req, res) => {
    let {id} = req.query;

    // let {startPrice, endPrice} = req.body;
    // console.log({startPrice, endPrice, id});
    
    let infoCategory = await CATEGORY_MODEL.getInfo(id);
    let infoCategoryWithPrice = await CATEGORY_MODEL.getInfoCategoryWithPrice(id);
    
    renderToView(req, res,'pages/shop', {infoCategory: infoCategory.data, infoCategoryWithPrice: infoCategoryWithPrice.data})
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

route.get('/dang-xuat', async (req, res) => {
    req.session.token = undefined;
    res.redirect('/customers');
})

route.get('/checkout', async (req, res) => {
    let { token } = req.session;
    let infoUser;
    if(token) {
        infoUser = await jwt.verify(token);
    }
    console.log({infoUser});
    
    renderToView(req, res, 'pages/checkout', {infoUser: infoUser.data})
})

route.post('/checkout', async (req, res) => {
    let { token } = req.session;
    let infoUser;
    if(token) {
        infoUser = await jwt.verify(token);
    }

    

    
})


module.exports = route;