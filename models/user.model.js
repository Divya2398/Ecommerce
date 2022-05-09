const mongoose=require('mongoose')
const crypto=require('crypto');

//usermangement schema
const userSchema= new mongoose.Schema({
    uuid:{type:String , required:false},
    first_name:{type:String ,required:true },
    last_name:{type:String ,required:true },
    UserName:{type:String , required:true ,trim:true , unique:true},
    emailid:{type:String, required:true ,trim:true,unique:true},
    Mobilenumber:{ type:String, required:true, trim:true, unique:true},
    password:{type:String, required:true, trim:true, unique:true},
    role:{type:String, enum :['Admin' , 'user'], required:true},
    VerifiedUser:{type:Boolean, required:false, default:false},
    loginStatus:{type: Boolean, required: false, default: false},
    otp:{type: String, required: false,}
}, 
{
    timestamps:true
});
userSchema.pre('save',function(next){
    this.uuid = 'USER-'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});    

module.exports=mongoose.model('user',userSchema);