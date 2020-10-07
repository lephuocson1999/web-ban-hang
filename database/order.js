var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        default: []
    }],
    total: Number,
    address: String,
    time: String,
    note: String,
    pay: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    status: Number
});

let Order_Coll = mongoose.model('order', orderSchema);
module.exports  = Order_Coll ;