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

route.get('/add-category', async (req, res) => {
    renderToView(req, res , 'dashboards/pages/add-category',{})
})

route.post('/them-danh-muc', async (req, res) => {
    let {title, description} = req.body;
    
    let infoCategory = await CATEGORY_MODEL.insert(title, description);
    if(infoCategory.error){
        return res.json(infoCategory);
    }
    
    res.json({infoCategory});
})

route.get('/delete/:id', async (req, res) => {
    let {id} = req.params;
    console.log({id});

    let infoCategory = await CATEGORY_MODEL.remove(id);

    if(infoCategory.error){
        return res.json(infoCategory)
    }
    res.json({infoCategory})
    
})

route.get('/list',ROLE_ADMIN ,async (req, res) => {
    renderToView(req, res, 'dashboards/pages/list-category', {});
})

route.get('/update-category/:id', async (req, res) => {
    let {id} = req.params;

    let infoCategory = await CATEGORY_MODEL.getInfo(id);

    renderToView(req, res, 'dashboards/pages/update-category', {infoCategory: infoCategory.data})
})

route.post('/update-category/:id', async (req, res) => {
    let {id} = req.params;

    let {title, description} = req.body;

    let infoCategory = await CATEGORY_MODEL.update({id, title, description});
    
    if(infoCategory.error){
        return res.json(infoCategory);
    }
    res.json({infoCategory});
})

module.exports = route;