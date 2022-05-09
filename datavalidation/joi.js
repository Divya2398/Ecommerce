const joi = require('joi')

const usertestSchema = joi.object({
    first_name: joi.string().pattern(new RegExp(/^[A-Za-z]+$/)).min(3).max(30).required(),
    last_name: joi.string().pattern(new RegExp(/^[A-Za-z]+$/)).min(1).max(20).required(),
    UserName: joi.string().pattern(new RegExp(/^[A-Za-z0-9]+$/)).min(6).max(15).required(),
    emailid: joi.string().email().lowercase().required(),
    Mobilenumber: joi.string().length(10).pattern(new RegExp(/^[0-9]+$/)).required(),
    password: joi.string().min(8).pattern(new RegExp(/^[A-Z]+[a-z]+[0-9]+$/)).required(),
    role: joi.string().valid('Admin', 'user').required(),
})

const producttestSchema = joi.object({
    productName: joi.string().required(),
    Description: joi.string().max(400).required(),
    price: joi.string().required(),
    categoryuuid: joi.string().required()
})
const categorytestSchema = joi.object({
    categoryName: joi.string().max(30).required(),
    useruuid : joi.string().required()
})
    
module.exports ={
    usertestSchema : usertestSchema ,
    producttestSchema : producttestSchema,
    categorytestSchema : categorytestSchema 
}