const jwt               = require('./jwt');
const moment            = require('moment');
const CATEGORY_MODEL        = require('../models/category');
const PRODUCT_MODEL        = require('../models/product');

let renderToView = async function(req, res, view, data) {
    let { token } = req.session;

    //let listProductOneCategory = await PRODUCT_MODEL.listProductOneCategory();
    let listProduct = await PRODUCT_MODEL.getList();
    let listProductAllCategories = await PRODUCT_MODEL.listProductAllCategories();
    let listCategory = await CATEGORY_MODEL.getList();
    // console.log(listCategory);
    
    // let listQuestion = await QUESTION_MODEL.getList();

    // if(token) {
    //     let user = await jwt.verify(token);
    //     data.infoUser = user.data;
        
    // } else {
    //     data.infoUser = undefined;
    // }

    data.moment         = moment;
    // data.listExam       = listExam.data;
    data.listProduct    = listProduct.data;
    data.listProductAllCategories  = listProductAllCategories.data;
    data.listCategory       = listCategory.data;
    // data.listQuestion   = listQuestion.data;
    // data.LEVEL_TYPES    = LEVEL_TYPES;

    return res.render(view, data);
}
exports.renderToView = renderToView;