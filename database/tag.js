var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
    
    title: String,

    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product'
    }]
});

let Tag_Coll = mongoose.model('tag', tagSchema);
module.exports  = Tag_Coll ;
