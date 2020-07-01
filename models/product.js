let PRODUCT_COLL = require('../database/product');
let CATEGORY_COLL = require('../database/category');
let PROMOTION_COLL = require('../database/promotion');
let ObjectID = require('mongoose').Types.ObjectId;

const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../utils/jwt');

module.exports = class PRODUCT {
    static insert({title, price, amout ,avatar, gallery, category, tag, promotion, status}){
        return new Promise(async resolve => {
            try {
                console.log({title, price, amout ,avatar, gallery, category, tag, promotion, status});
                
                let infoProduct = await PRODUCT_COLL.findOne({title});
                if (infoProduct) {
                    return resolve({error: true, message: 'exist'})
                }
                let newProduct;
                if(ObjectID.isValid(promotion)){
                    newProduct = new PRODUCT_COLL({title, price, amout ,avatar, gallery, category, tag, promotion, status});
                }else{
                    newProduct = new PRODUCT_COLL({title, price, amout ,avatar, gallery, category, tag, status});
                }
                
                let infoCategoryAfterInsert = await newProduct.save();
                if(!infoCategoryAfterInsert){
                    return resolve({error: true, message:'cannot_insert_product'});
                }   
                
                let { _id: productID } = infoCategoryAfterInsert;

                let infoCategoryAfterUpdate = await CATEGORY_COLL.findByIdAndUpdate(category, {
                    $addToSet: {
                        products: productID
                    }
                });

                if(ObjectID.isValid(promotion)){
                    let infoPromotionAfterUpdate = await PROMOTION_COLL.findByIdAndUpdate(promotion, {
                        $addToSet: {
                            products: productID
                        }
                    });
                    if(!infoPromotionAfterUpdate)
                        return resolve({error: true, message: 'cannot_update_promotion'});
                }

                if(!infoCategoryAfterUpdate)
                    return resolve({error: true, message: 'cannot_update_category'});
                return resolve({error: false, message: 'insert_success'});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getList(){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({})
                .populate('category')
                .populate('promotion')
                ;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                return resolve({error: false, message: 'get_list_products_success', data: listProducts});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    // filter  theo giá có ID category
    static getListForPriceWithCategory(id, startPrice, endPrice){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({category: id})
                .populate('category')
                .populate('promotion')
                ;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }

                let arrProduct = [];
                listProducts.forEach(item => {
                    if(item.promotion){
                        let a = item.price - item.price * item.promotion.percent / 100;
                        if(a >= Number(startPrice) && a <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }else{
                        if(item.price >= Number(startPrice) && item.price <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }
                })
                return resolve({error: false, message: 'get_list_products_success', data: arrProduct});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    //filter theo giá có Category ID và Promotion ID
    static getListForPriceWithCategoryAndPromotion(id, startPrice, endPrice, promotionID){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({
                    category: id, 
                    promotion: promotionID
                })
                .populate('category')
                .populate('promotion')
                ;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                let arrProduct = [];
                listProducts.forEach(item => {
                    if(item.promotion){
                        let a = item.price - item.price * item.promotion.percent / 100;
                        if(a >= Number(startPrice) && a <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }else{
                        if(item.price >= Number(startPrice) && item.price <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }
                })
                return resolve({error: false, message: 'get_list_products_success', data: arrProduct});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    //get List Product kh cs id Cateogry và có Id promotion
    static getListProductWithPromotions(id, startPrice, endPrice){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({promotion: id})
                .populate('category')
                .populate('promotion')
                ;
                // let listProducts = await PRODUCT_COLL.aggregate({
                //     $match: {
                //         promotion: id
                //     }, 
                //     $lookup: {
                //         from: "categories",
                //         localField: "category",
                //         foreignField: "_id",
                //         as: "category"
                //     }
                // })
                // .populate('category')
                // .populate('promotion')
                // ;
                // console.log({listProducts});
                
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                let arrProduct = [];
                listProducts.forEach(item => {
                    if(item.promotion){
                        let a = item.price - item.price * item.promotion.percent / 100;
                        if(a >= Number(startPrice) && a <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }else{
                        if(item.price >= Number(startPrice) && item.price <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }
                })
                return resolve({error: false, message: 'get_list_products_success', data: arrProduct});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }


    static getListProductWithPromotion(id){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({promotion: id})
                .populate('category')
                .populate('promotion')
                ;
                // let listProducts = await PRODUCT_COLL.aggregate({
                //     $match: {
                //         promotion: id
                //     }, 
                //     $lookup: {
                //         from: "categories",
                //         localField: "category",
                //         foreignField: "_id",
                //         as: "category"
                //     }
                // })
                // .populate('category')
                // .populate('promotion')
                // ;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                
                return resolve({error: false, message: 'get_list_products_success', data: listProducts});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getListProductWithPromotionCategory(id, categoryID){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({
                        promotion: id, 
                        category: categoryID
                })
                .populate('category')
                .populate('promotion')
                ;
                // let listProducts = await PRODUCT_COLL.aggregate({
                //     $match: {
                //         promotion: id
                //     }, 
                //     $lookup: {
                //         from: "categories",
                //         localField: "category",
                //         foreignField: "_id",
                //         as: "category"
                //     }
                // })
                // .populate('category')
                // .populate('promotion')
                // ;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                
                return resolve({error: false, message: 'get_list_products_success', data: listProducts});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    
    static getListForPrice(startPrice, endPrice){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.find({})
                .populate('category')
                .populate('promotion')
                ;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                // console.log({startPrice, endPrice});
                
                let arrProduct = [];
                listProducts.forEach(item => {
                    if(item.promotion){
                        let a = item.price - item.price * item.promotion.percent / 100;
                        if(a >= Number(startPrice) && a <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }else{
                        if(item.price >= Number(startPrice) && item.price <= Number(endPrice)){
                            arrProduct.push(item);
                        }
                    }
                })
                
                return resolve({error: false, message: 'get_list_products_success', data: arrProduct});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static search(search){
        return new Promise(async resolve => {
            try {
                let dataSearch = await PRODUCT_MODEL.find({
                    $or: [
                        { title: new RegExp(search, 'i') },
                    ]
                });
                return resolve({error: false, message:'finded', data: dataSearch})
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getListProductOneCategory(id){
        return new Promise(async resolve => {
            try {
                let listProducts = await PRODUCT_COLL.findOne({category: id}).populate('category');;
                console.log({listProducts});
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                return resolve({error: false, message: 'get_list_products_success',data: listProducts });
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    // static getListProductSale(){
    //     return new Promise(async resolve => {
    //         try {
    //             let listProducts = await PRODUCT_COLL.find({});
                
    //         } catch (error) {
                
    //         }
    //     })
    // }


    static getInfo(productID){
        return new Promise(async resolve => {
            try {
                let infoProduct = await PRODUCT_COLL.findById(productID)
                .populate('category')
                .populate('promotion');
                if(!infoProduct){
                    return resolve({error: true, message:'not_found_product'});
                }
                return resolve({error: false, message:'get_info_success', data: infoProduct});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    static update({id, title, description, price, salePrice ,avatar, gallery, category}) {
        return new Promise(async resolve => {
            try {
                console.log({id, title, description, price, salePrice ,avatar, gallery, category});
                
                if(!ObjectID.isValid(id)){
                    return resolve({error: true, message:'params_invalid'});
                }
                let listProduct = await PRODUCT_COLL.findByIdAndUpdate(id,{
                    title, description, price, salePrice ,avatar, gallery, category
                }
                ,{
                    new: true
                });
                console.log({listProduct});
                
                if(!listProduct){
                    return resolve({error: true, message:'cannot_update_list'});
                }
                return resolve({error: false, message:'update_data_success', data: listProduct});


            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove(id, categoryId, promotionId){
        return new Promise(async resolve => {
            try {

                let listProductForRemove = await PRODUCT_COLL.findByIdAndDelete(id);
                let listCategoryForRemove = await CATEGORY_COLL.findByIdAndUpdate(categoryId,{
                    $pull: {
                        products: id
                    }
                    
                })
                
                if(ObjectID.isValid(promotionId)){
                    let listPromotionForRemove = await PROMOTION_COLL.findByIdAndUpdate(promotionId,{
                        $pull: {
                            products: id
                        }
                    })
                    console.log(listPromotionForRemove);
                }
                
                return resolve({error: false, message:'remove_success'});
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static listProductAllCategories(){
        return new Promise(async resolve => {
            try {
                let listProduct = await CATEGORY_COLL.find({}).populate('products');
                // let listProductID = listProduct.products;
                // let listProduct  = await PRODUCT_COLL.find(listProductID)            
                return resolve({error: false, message:'get_listProduct_success', data: listProduct})
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }
}
