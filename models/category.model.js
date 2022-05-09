const mongoose = require('mongoose')
const crypto = require('crypto')

const categorySchema = new mongoose.Schema({
    uuid : {type : String, required: false},
    categoryName : {type: String, required: true},
    useruuid : {type: String, required: true}
},
{
    timestamps : true
});

categorySchema.pre('save',function(next){
    this.uuid = 'CAT-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid)
    next()
});

module.exports=mongoose.model('category',categorySchema);