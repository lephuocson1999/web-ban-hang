const jwt               = require('./jwt');
const moment            = require('moment');
const CATEGORY_MODEL        = require('../models/category');
const PRODUCT_MODEL        = require('../models/product');
const PROMOTION_MODEL        = require('../models/promotion');
const CART_MODEL        = require('../models/cart');

let renderToView = async function(req, res, view, data) {
    let { token } = req.session;

    let cart = req.session.cart;

    let cartArr;
    if(!cart){
        data.cartArr = undefined;
        data.cart = undefined;
    }else{
        cartArr = new CART_MODEL(cart);
        data.cartArr = cartArr.generateArray();
        data.cart = cart;
    }
    

    //let listProductOneCategory = await PRODUCT_MODEL.listProductOneCategory();
    let listProduct = await PRODUCT_MODEL.getList();
    let listProductAllCategories = await PRODUCT_MODEL.listProductAllCategories();
    let listCategory = await CATEGORY_MODEL.getList();
    let listPromotion = await PROMOTION_MODEL.getList();
    // console.log(listCategory);
    // let listQuestion = await QUESTION_MODEL.getList();
    if(token) {
        let user = await jwt.verify(token);
        data.infoUser = user.data;
    } else {
        data.infoUser = undefined;
    }
    
    

    data.moment         = moment;
    // data.listExam       = listExam.data;
    data.listProduct    = listProduct.data;
    data.listPromotion    = listPromotion.data;
    data.listProductAllCategories  = listProductAllCategories.data;
    data.listCategory       = listCategory.data;
    // data.LEVEL_TYPES    = LEVEL_TYPES;

    return res.render(view, data);
}
exports.renderToView = renderToView;