const mongoose = require('mongoose');
const crypto = require('crypto')

const productSchema = new mongoose.Schema({
    uuid: {type:String, required:false},
    productName: {type:String, required:true, trim:true},
    Description: {type:String, required:true},
    price: {type:String, required:true},
   categoryuuid: {type: String, required:true}
},

{
    timestamps:true
})

productSchema.pre('save', function(next){
    this.uuid = 'product-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});
module.exports = mongoose.model('product',productSchema)