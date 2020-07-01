const route = require('express').Router();
//MODELS
const  PRODUCT_MODEL  = require('../models/product');
const  PPROMOTION_MODEL  = require('../models/promotion');
const  CATEGORY_MODEL  = require('../models/category');
const  CART_MODEL  = require('../models/cart');
let PRODUCT_COLL = require('../database/product');

//MIDDLEWARE
// let PRODUCT_MODEL = require('../models/product');
const { renderToView }  = require('../utils/childRouting');
const { uploadMulter} = require('../utils/config_multer');
const path          = require('path');
const fs            = require('fs');
const ROLE_ADMIN = require('../utils/checkRole');
let ObjectID = require('mongoose').Types.ObjectId;

route.get('/add-product',ROLE_ADMIN, async (req, res) => {
    renderToView(req, res, 'dashboards/pages/add-product', {})
})

route.post('/them-san-pham' ,uploadMulter.single('avatar') ,async (req, res) => {
    let {title, price, amout , gallery, category, tag, promotion, status} = req.body;
    let infoFile = req.file;
    console.log({title, price, amout , gallery, category, tag, promotion, status});

    let infoProduct = await PRODUCT_MODEL.insert({title, price, amout ,avatar: infoFile.originalname, gallery, category, tag, promotion, status});
    console.log(infoProduct);

    if(infoProduct.error){
        return res.json(infoProduct);
    }
    res.json({infoProduct});
})

route.get('/list',ROLE_ADMIN ,async (req,res) => {
    renderToView(req, res, 'dashboards/pages/list-product', {})
})

route.post('/delete/:id', async (req, res) => {
    let {id} = req.params;
    console.log({id});

    let {categoryId, promotionId} = req.body;
    console.log({categoryId, promotionId});


    let infoProduct = await PRODUCT_MODEL.remove(id, categoryId, promotionId);
    res.json({infoProduct})
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
        return res.json({error: false, data: cart.generateArray()});
    })
    

    // let infoProduct = await PRODUCT_MODEL.getInfo(productID);
    // let productArr = [];
    // productArr.push(infoProduct.data);
    // req.session.infoProduct = idArr;
    // console.log({productArr});
    // renderToView(req, res, 'pages/customer', {productArr})
})

route.post('/search-price',async (req, res) => {
    let {id} = req.query;

    let {startPrice, endPrice, promotionID} = req.body;

    let listProduct;
    if(ObjectID.isValid(id) && !ObjectID.isValid(promotionID)){
        listProduct = await PRODUCT_MODEL.getListForPriceWithCategory(id, startPrice, endPrice);
    }else if(ObjectID.isValid(id) && ObjectID.isValid(promotionID)){
        listProduct = await PRODUCT_MODEL.getListForPriceWithCategoryAndPromotion(id, startPrice, endPrice, promotionID);
    }else if(!ObjectID.isValid(id) && ObjectID.isValid(promotionID)){
        listProduct = await PRODUCT_MODEL.getListProductWithPromotions(promotionID, startPrice, endPrice)
    }else{
        listProduct = await PRODUCT_MODEL.getListForPrice(startPrice, endPrice);
    }
    // console.log({listProduct});
    
    res.json({listProduct: listProduct.data});
})

route.post('/filter-promotion',async (req, res) => {
    let {id} = req.query;
    // console.log({id});
    let {categoryID} = req.body;
    // console.log(startPrice, endPrice);
    let listProduct;
    if(ObjectID.isValid(categoryID)){
        listProduct = await PRODUCT_MODEL.getListProductWithPromotionCategory(id, categoryID);
    }else{
        listProduct = await PRODUCT_MODEL.getListProductWithPromotion(id);
    }
    // console.log({listProduct});
    
    res.json({listProduct: listProduct.data});
})

route.post('/search-price-with-category/:id',async (req, res) => {
    
    let {id} = req.query;

    let {startPrice, endPrice} = req.body;
    console.log(startPrice, endPrice, id);
    
    let listProduct = await PRODUCT_MODEL.getListForPrice(startPrice, endPrice);
    console.log({listProduct});
    res.json({listProduct: listProduct.data});

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



module.exports = route;