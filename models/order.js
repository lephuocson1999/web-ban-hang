let ORDER_COLL = require('../database/order');
let PRODUCT_COLL = require('../database/product');
let ObjectID = require('mongoose').Types.ObjectId;

const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../utils/jwt');

module.exports = class ORDER {
    static insert({productsArr, total, address, note, pay, user}){
        return new Promise(async resolve => {
            try {
                // console.log({productsArr, total, address, note, pay, user});
                let products= [];
                productsArr.forEach(item => {
                    // console.log(item.item._id);
                    products.push(item.item._id);
                })
                // console.log({products});
                
                let newOrder = new ORDER_COLL({products, total, address, note, pay, user});
                let infoOrderAfterInsert = await newOrder.save();
                if(!infoOrderAfterInsert){
                    return resolve({error: true, message:'cannot_insert_user'});
                }               
                return resolve({error: false, message: 'insert_success', data: infoOrderAfterInsert});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getList(){
        return new Promise(async resolve => {
            try {
                let listOrder = await ORDER_COLL.find({})
                .populate('user')
                .populate('products');
                if (!listOrder){
                    return resolve({error: true, message: 'cannot_get_listUser'});
                }
                return resolve({error: false, message: 'get_list_user_success', data: listOrder});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getListWithPrice(){
        return new Promise(async resolve => {
            try {
                // console.log('aaaaa');
                // let listOrder = await ORDER_COLL.find({})
                // .populate('user')
                // .populate('products');

                // let arrOrder = []; 
                // if(listOrder && listOrder.length){
                //     listOrder.forEach(item => {
                //         item.products.forEach(element => {
                //             arrOrder.push(element)
                //         })
                //     })
                // }
                let listOrders;
                let listProduct = [];

                // arrOrder.forEach(async item =>{
                //         // console.log({item});
                listOrders = await ORDER_COLL.aggregate([{
                        $unwind: {
                                path: "$products",
                                includeArrayIndex: "arrayIndex"
                        }
                    },
                    {  
                        $group: {
                            _id: "$products",
                            total: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort: {
                            total: -1
                        }
                    },
                    {
                        $limit : 5 
                    }
                ])
                // })
                // console.log({listOrders});

                listOrders.forEach(async item => {
                    // console.log(item._id);
                    let infoProducts = await PRODUCT_COLL.findById(item._id)
                    // .populate('category')
                    // .populate('promotion');
                    // console.log({infoProducts});
                    listProduct.push(infoProducts);
                    // console.log({listProduct});
                })
                // console.log({listProduct});

                
                if (!listProduct){
                    return resolve({error: true, message: 'cannot_get_listUser'});
                }
                return resolve({error: false, message: 'get_list_user_success', data: listProduct});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }

    static getInfo(id){
        return new Promise(async resolve => {
            try {
                let infoUser = await USER_COLL.findById(id);
                if(!infoUser){
                    return resolve({error: true, message:'not_found_infoUser'});
                }
                return resolve({error: false, message:'get_info_success'});
            } catch (error) {
                return resolve({error: true, message: error.message});
            }
        })
    }
    static update({id, name, phone, email, sex}) {
        return new Promise(async resolve => {
            try {
                console.log({id, name, phone, email, sex});
                
                if(!ObjectID.isValid(id)){
                    return resolve({error: true, message:'params_invalid'});
                }
                let listUser = await USER_COLL.findByIdAndUpdate(id,{
                    name, phone, email, sex
                }
                ,{
                    new: true
                });
                
                if(!listUser){
                    return resolve({error: true, message:'cannot_update_list'});
                }
                return resolve({error: false, message:'update_data_success', data: listUser});


            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static remove(id){
        return new Promise(async resolve => {
            try {
                let listUserForRemove = await USER_COLL.findByIdAndDelete(id);
                return resolve({error: false, message:'remove_success'});
            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        })
    }

    static signIn(username, password){
        return new Promise(async resolve => {
            try {
                let infoUser = await USER_COLL.findOne({username});

                if(!infoUser){

                    return resolve({ error: true, message: 'user_not_exist' });
                }

                let passwordInfo = infoUser.password

                const checkPass = await compare(password, passwordInfo);
                // console.log({checkPass});

                if(!checkPass){
                    return resolve({ error: true, message: 'password_not_exist' });
                }
                await delete infoUser.password;
                let token = await sign({data:infoUser});
                // console.log({token});
                return resolve({ error: false, data: { infoUser, token } });

            } catch (error) {
                return resolve({ error: true, message: error.message });
            }
        });
    }
}
