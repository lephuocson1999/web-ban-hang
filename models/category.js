let CATEGORY_COLL = require('../database/category');
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
                console.log({id, title, description});
                
                if(!ObjectID.isValid(id)){
                    return resolve({error: true, message:'params_invalid'});
                }
                let listCategory = await CATEGORY_COLL.findByIdAndUpdate(id,{
                    title, description
                }
                ,{
                    new: true
                });
                console.log({listCategory});
                
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
                let listCategoryForRemove = await CATEGORY_COLL.findByIdAndDelete(id);
                return resolve({error: false, message:'remove_success'});
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

}