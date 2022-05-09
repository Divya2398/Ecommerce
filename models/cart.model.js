
const mongoose = require('mongoose');
const crypto = require('crypto')

const cartSchema = new mongoose.Schema({
    uuid : {type: String, required: false},
    useruuid :{type: mongoose.Schema.Types.String, ref: 'User'},
    cartItems: [
        {
            productuuid: String,
            productName: String, 
            quantity:  Number ,
            price: Number,
        }
    ],
    total : {type : Number, required: false, default :0 }   
}, 

{ 
    timestamps: true
 }
);

cartSchema.pre('save', function(next){
    this.uuid = 'cart-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});
module.exports = mongoose.model('Cart', cartSchema);


