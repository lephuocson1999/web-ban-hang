var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    title: { 
        type: String,
        required: true,
        trim: true
    },
    description: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
        default: []
    }]
});

let Category_Coll =mongoose.model('category', categorySchema);
module.exports  = Category_Coll ;