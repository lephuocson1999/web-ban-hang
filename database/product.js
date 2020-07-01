var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    
    title: String,

    price: Number,

    amout: Number,

    avatar: String,

    gallery: String,

    seen: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],

    like: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],

    category: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    },

    tag: [{
        type: Schema.Types.ObjectId,
        ref: 'tag'
    }],

    promotion: {
        type: Schema.Types.ObjectId,
        ref: 'promotion'
    },


    status:{
        type: Number,
        default: 0
    }
});

let Product_Coll = mongoose.model('product', productSchema);
module.exports  = Product_Coll ;
