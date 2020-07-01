var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var promotionSchema = new Schema({
    
    title: String,

    content: String,

    percent: Number,

    avatar: String,

    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product'
    }],
    
    status: Number
});

let Promotion_Coll = mongoose.model('promotion', promotionSchema);
module.exports  = Promotion_Coll ;
