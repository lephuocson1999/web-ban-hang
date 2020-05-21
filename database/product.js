var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    
    title: String,

    description: String,

    price: Number,

    salePrice: Number,

    avatar: String,

    gallery: String,

    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },

    location: {
        longitude: Number,
        latitude: Number
    }   
    
});

let Product_Coll = mongoose.model('product', productSchema);
module.exports  = Product_Coll ;
