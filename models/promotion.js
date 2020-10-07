let PRODUCT_COLL = require('../database/product');
let PROMOTION_COLL = require('../database/promotion');
let ObjectID = require('mongoose').Types.ObjectId;

module.exports = class PROMOTION {
    static insert({title, content, percent ,avatar ,status}){
        return new Promise(async resolve => {
            try {
                
                let infoPromotion = await PROMOTION_COLL.findOne({title});
                if (infoPromotion) {
                    return resolve({error: true, message: 'exist'})
                }
                let newPromotion = new PROMOTION_COLL({title, content, percent ,avatar ,status});
                let infoPromotionAfterInsert = await newPromotion.save();
                if(!infoPromotionAfterInsert){
                    return resolve({error: true, message:'cannot_insert_promotion'});
                }   
                
                return resolve({error: false, message: 'insert_success'});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getList(){
        return new Promise(async resolve => {
            try {
                let listPromotions = await PROMOTION_COLL.find({}).populate('products');;
                if (!listPromotions){
                    return resolve({error: true, message: 'Promotions'});
                }
                return resolve({error: false, message: 'get_list_Promotions_success', data: listPromotions});
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


    static getInfo(promotionID){
        return new Promise(async resolve => {
            try {
                let infoProduct = await PROMOTION_COLL.findById(promotionID)
                .populate('products');
                if(!infoProduct){
                    return resolve({error: true, message:'not_found_promotion'});
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
                // console.log({id, title, description, price, salePrice ,avatar, gallery, category});
                
                if(!ObjectID.isValid(id)){
                    return resolve({error: true, message:'params_invalid'});
                }
                let listProduct = await PRODUCT_COLL.findByIdAndUpdate(id,{
                    title, description, price, salePrice ,avatar, gallery, category
                }
                ,{
                    new: true
                });
                // console.log({listProduct});
                
                if(!listProduct){
                    return resolve({error: true, message:'cannot_update_list'});
                }
                return resolve({error: false, message:'update_data_success', data: listProduct});


            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove(id){
        return new Promise(async resolve => {
            try {
                let listProductForRemove = await PRODUCT_COLL.findByIdAndDelete(id);
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
