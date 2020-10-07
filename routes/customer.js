const route = require('express').Router();
//MODELS
const  CATEGORY_MODEL  = require('../models/category');
const  PRODUCT_MODEL  = require('../models/product');
const  PROMOTION_MODEL  = require('../models/promotion');
const  USER_MODEL  = require('../models/user');
const  ORDER_MODEL  = require('../models/order');
const passport = require('passport')
const  CART_MODEL  = require('../models/cart');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
let { uploadMulter} = require('../utils/config_multer');
const jwt               = require('../utils/jwt');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let {CF_ROUTINGS} = require('../constant/core/base_api')
let ObjectID = require('mongoose').Types.ObjectId;

route.get(CF_ROUTINGS.HOME, async (req, res) => {
    renderToView(req,res, 'pages/customer',{  });
})

route.get(CF_ROUTINGS.REGISTER, async (req, res) => {

    renderToView(req, res, 'pages/sign-up',{})
})

route.post(CF_ROUTINGS.REGISTER, async (req, res) => {
    let {username, name, password} = req.body;
    //console.log({username, name, password});

    let infoUser = await USER_MODEL.insert(username, name, password);
    if(infoUser.error){
        return res.json(infoUser)
    }
    
    res.json({infoUser: infoUser.data});
})

route.get(CF_ROUTINGS.LOGIN, async (req, res) => {

    renderToView(req, res, 'pages/sign-in',{})
})

route.post(CF_ROUTINGS.LOGIN, async (req, res) => {
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

route.get(CF_ROUTINGS.LIST_PRODUCTS, async (req, res) => {
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

route.get(CF_ROUTINGS.DETAIL_PRODUCTS, async (req,res) => {
    let {productID} = req.query;

    let infoProduct = await PRODUCT_MODEL.getInfo(productID);
    
    let {id} = infoProduct.data.category;

    let infoCategory = await CATEGORY_MODEL.getInfo(id);
    
    renderToView(req, res, 'pages/product-detail',{infoProduct: infoProduct.data, infoCategory: infoCategory.data})
})

route.get(CF_ROUTINGS.CART, async (req, res) => {
    renderToView(req, res, 'pages/cart', {})
})

route.get(CF_ROUTINGS.LOG_OUT, async (req, res) => {
    req.session.token = undefined;
    res.redirect('/customers');
})

route.get(CF_ROUTINGS.CHECKOUT, async (req, res) => {
    let { token } = req.session;
    let infoUser;
    if(token) {
        infoUser = await jwt.verify(token);
    }
    // console.log({infoUser});
    
    renderToView(req, res, 'pages/checkout', {infoUser: infoUser.data})
})

route.post(CF_ROUTINGS.CHECKOUT, async (req, res) => {
    let { token } = req.session;
    let infoUser;
    if(token) {
        infoUser = await jwt.verify(token);
    }

    let cart = req.session.cart;
    let cartArr;
    cartArr = new CART_MODEL(cart);
    let productsArr = cartArr.generateArray();
    

    let {name, phone, email, address, sex ,note, total, pay} = req.body;
    
    let infoUserAfterUpdate = await USER_MODEL.update({id: infoUser.data._id, name, phone, email, sex})
    // console.log({infoUserAfterUpdate});
    
    let infoOrder = await ORDER_MODEL.insert({productsArr, total, address, note, pay, user: infoUser.data._id})
    // console.log({infoOrder});
    
    res.json({infoOrder});
})


module.exports = route;