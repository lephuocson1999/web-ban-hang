const route = require('express').Router();
//MODELS
const  PRODUCT_MODEL  = require('../models/product');
const  CART_MODEL  = require('../models/cart');
let PRODUCT_COLL = require('../database/product');

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

route.post('/get-info-product-to-session', async(req, res) => {
    let {productID} = req.query;
    // console.log({productID});
    
    let cart = new CART_MODEL(req.session.cart ? req.session.cart: {})
    
    await PRODUCT_COLL.findById(productID, function(err, product){
        if(err){
            return res.json({error: true});
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        // console.log(req.session.cart);
        // res.json({product})
        return res.json({error: false, data: cart});
    })
    

    // let infoProduct = await PRODUCT_MODEL.getInfo(productID);
    // let productArr = [];
    // productArr.push(infoProduct.data);
    // req.session.infoProduct = idArr;
    // console.log({productArr});
    // renderToView(req, res, 'pages/customer', {productArr})
})

route.post('/delete-cart', async(req, res) => {
    let {productID} = req.query;
    // console.log({productID});
    let cart = new CART_MODEL(req.session.cart);
    let cartArr = cart.generateArray();

    cart.remove(cartArr, productID);
    
    // await PRODUCT_COLL.findById(productID, function(err, product){
    //     if(err){
    //         return res.json({error: true});
    //     }
    //     cart.add(product, product.id);
    //     req.session.cart = cart;
    //     return res.json({error: false, data: cart});
    // })
})

route.get('/danh-sach-san-pham/danh-muc', async (req,res) => {
    let {id} = req.query;
    
})


module.exports = route;