var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: []
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        default: []
    }]
});

let Cart_Coll =mongoose.model('cart', cartSchema);
module.exports  = Cart_Coll ;