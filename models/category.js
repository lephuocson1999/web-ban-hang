let CATEGORY_COLL = require('../database/category');
let PRODUCT_COLL = require('../database/product');
let ObjectID = require('mongoose').Types.ObjectId;

const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../utils/jwt');

module.exports = class CATEGORY {
    static insert(title, description){
        return new Promise(async resolve => {
            try {
                console.log({title, description});
                
                let infoCategory = await CATEGORY_COLL.findOne({title});
                if (infoCategory) {
                    return resolve({error: true, message: 'exist'})
                }
                let newCategory = new CATEGORY_COLL({title, description});
                let infoCategoryAfterInsert = await newCategory.save();
                if(!infoCategoryAfterInsert){
                    return resolve({error: true, message:'cannot_insert_category'});
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
                let listCategories = await CATEGORY_COLL.find({});
                if (!listCategories){
                    return resolve({error: true, message: 'cannot_get_categories'});
                }
                return resolve({error: false, message: 'get_list_categories_success', data: listCategories});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    static getInfo(id){
        return new Promise(async resolve => {
            try {
                let infoCategory = await CATEGORY_COLL.findById(id)
                .populate('products');
                
                if(!infoCategory){
                    return resolve({error: true, message:'not_found_categoryS'});
                }
                return resolve({error: false, message:'get_info_success',data: infoCategory});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getInfoCategoryWithPrice(id){
        return new Promise(async resolve => {
            try {
                let infoCategory = await CATEGORY_COLL.findById(id)
                .populate('products');

                let infoProduct = await PRODUCT_COLL.find({category: id})
                .populate('category')
                .populate('promotion');

                if (!infoProduct){
                    return resolve({error: true, message: 'not_found_products'});
                }

                // let arrProduct = [];
                // infoProduct.forEach(item => {
                //     if(item.promotion){
                //         let a = item.price - item.price * item.promotion.percent / 100;
                //         if(a >= Number(startPrice) && a <= Number(endPrice)){
                //             arrProduct.push(item);
                //         }
                //     }else{
                //         if(item.price >= Number(startPrice) && item.price <= Number(endPrice)){
                //             arrProduct.push(item);
                //         }
                //     }
                // })

                if(!infoCategory){
                    return resolve({error: true, message:'not_found_categoryS'});
                }
                return resolve({error: false, message:'get_info_success',data: infoProduct});
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
                

            } catch (error) {
                
            }
        })
    }

    static update({id, title, description}) {
        return new Promise(async resolve => {
            try {
                
                if(!ObjectID.isValid(id)){
                    return resolve({error: true, message:'params_invalid'});
                }

                let a = await CATEGORY_COLL.findOne({title});

                if(a){
                    return resolve({error: true, message:'name_existed'});
                }

                let listCategory = await CATEGORY_COLL.findByIdAndUpdate(id,{
                    title, description
                }
                ,{
                    new: true
                });
                
                if(!listCategory){
                    return resolve({error: true, message:'cannot_update_list'});
                }
                return resolve({error: false, message:'update_data_success', data: listCategory});


            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove(id){
        return new Promise(async resolve => {
            try {

                let infoCategory = await CATEGORY_COLL.findById(id)
                .populate('products');

                // let listCategoryForRemove = await CATEGORY_COLL.findByIdAndDelete(id)
                // .populate('products');
                
                let { _id: categoryID, products: productID } = infoCategory;
                // let productID = [] ;
                // productID = listCategoryForRemove.products;
                console.log({productID, categoryID});
                

                // let infoProductAfterUpdate = await PRODUCT_COLL.findByIdAndDelete(category, {
                //         $pull: {
                //             products: productID
                //         },
                // })
                // return resolve({error: false, message:'remove_success'});

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

}