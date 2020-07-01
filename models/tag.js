let PRODUCT_COLL = require('../database/product');
let CATEGORY_COLL = require('../database/category');
let ObjectID = require('mongoose').Types.ObjectId;

const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../utils/jwt');

module.exports = class PRODUCT {
    static insert(title, price, amout ,avatar, gallery, category, tag, promotion, status){
        return new Promise(async resolve => {
            try {
                console.log({title, price, amout ,avatar, gallery, category, tag, promotion, status});
                
                let infoProduct = await PRODUCT_COLL.findOne({title});
                if (infoProduct) {
                    return resolve({error: true, message: 'exist'})
                }
                let newProduct = new PRODUCT_COLL({title, price, amout ,avatar, gallery, category, tag, promotion, status});
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
                let listProducts = await PRODUCT_COLL.find({}).populate('category');;
                if (!listProducts){
                    return resolve({error: true, message: 'products'});
                }
                return resolve({error: false, message: 'get_list_products_success', data: listProducts});
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
                .populate('category');
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
