<<<<<<< HEAD
const router = require('express').Router();
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');

const userSchema = require("../models/user.model");
const {usertestSchema} = require("../datavalidation/joi")
const mail_to_customer = require("../middleware/email")

router.post('/user-signup', async(req,res)=>{
    try {
        const UserName = req.body.UserName;
        const emailid= req.body.emailid;
        const Mobilenumber = req.body.Mobilenumber;
        if(UserName && emailid && Mobilenumber ){
            let name = await userSchema.findOne({'UserName': UserName})
            let mailid = await userSchema.findOne({'emailid': emailid})
            let phonenumber= await userSchema.findOne({'Mobilenumber': Mobilenumber})
            if(name){
                return res.json({status: "failure", message: 'username already exist'})
            }
            else if(mailid){
                return res.json({status: "failure", message: 'email already exist'})
            }
            else if(phonenumber){
                return res.json({status: "failure", message: 'mobileNumber already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must enter the username , emailid and Mobilenumber'})
        }
        const mailData ={
            from : "dazzlingshinne@gmail.com",
            to : emailid,
            subject : "email verification",
            fileName : "verifymail.ejs",
            details : {
            emailid:emailid
            }
        }
        let verifymail = mail_to_customer.mail_to_customer(mailData)
        const test =  await usertestSchema.validateAsync(req.body)
        let userdetail = new userSchema(req.body)
        let password=req.body.password;
        let salt = await bcrypt.genSalt(10);
        userdetail.password = bcrypt.hashSync(password, salt);
        let result = await userdetail.save();  
        console.log("after hashing:"+ userdetail.password);
        return res.status(200).json({status: "success", message: "user details are added successfully", data: result})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
});
router.get("/email-verification/:emailid", async(req,res)=>{
    try {
        const detail=await userSchema.findOne({emailid: req.params.emailid}).exec();
        if(detail){
            userSchema.updateOne({emailid: req.params.emailid}, {VerifiedUser:true},{new:true}).exec();

            return res.status(200).json("account verified successfully")
        }else{
            return res.status(200).json("account verification failed")
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
})

router.post('/user-login' , async(req,res)=>{
    try {
         let  UserName = req.body.UserName;
         let password = req.body.password;
         let userdetails;      
         let finddetails = await userSchema.findOne({UserName: UserName}).exec()
         if(UserName){
             userdetails = await userSchema.findOne({UserName: UserName }).exec()
             if(!userdetails){
                 return res.status(400).json({status: "failure", message: "please signup first"});
                }
            }else{
             return res.status(400).json({status: "failure", message: "Please enter the username"})
            }
         if(userdetails){ 
             let isMatch = await bcrypt.compare(password, userdetails.password)
             if(isMatch){  
                await userSchema.findOneAndUpdate({uuid: userdetails.uuid}, {loginStatus: true}, {new:true}).exec() 
                let payload = {uuid: userdetails.uuid, role: userdetails.role, _id: userdetails._id}
                var Data = finddetails.toObject()
                let jwttoken = jwt.sign(payload, process.env.secrectKey)
                Data.jwttoken = jwttoken  
                return res.status(200).json({status: "success", message: "Login successfully", data : Data})
               
             }else{
                 return res.status(200).json({status: "failure", message: "Incorrect password"})
             }  
            
         }
        return res.status(200).json({status : "success", messsage: "login successful", data: "result"})
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"failure", message:error.message})    
    }
 })

 router.post('/user-logout', async(req,res)=>{
    try {
      await userSchema.findOneAndUpdate({uuid: req.query.uuid}, {loginStatus: false}, {new:true}).exec()
      return res.status(200).json({status: "success", message: "Logout successfully"})
     } catch (error) {
       console.log(error.message)
       return res.status(500).json({status: "failure", message: error.message})
  }
    }
)
router.put('/forgot-passsword', async(req,res)=>{
    try {
        let UserName = req.body.UserName;
        let newpassword = req.body.newpassword;
        let userdata
        if(UserName){
            userdata = await userSchema.findOne({UserName : UserName}).exec()
            if(!userdata){
                return res.status(400).json({"status" : "process fail" , "message":"couldn't find such username, signup first"})
            }
        }else{
            return res.status(404).json({"status" : "fail", "message":"you have to enter your username to proceed further"})
        }
        if(userdata){
            console.log(userdata.password)
            console.log("newpassword"+" "+newpassword)
            let Salt= await bcrypt.genSalt(10);
            newpassword=bcrypt.hashSync(newpassword,Salt);
            console.log(newpassword)
            change = await userSchema.findOneAndUpdate({uuid : userdata.uuid} , {password : newpassword} , {new : true})
            return res.status(200).json({"status" : "success" , "message" : "password changed successfully" , "result":change})
        }  
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"failure", message:error.message}) 
    }        
})

=======
const router = require('express').Router();
const bcrypt=require('bcrypt');
const jwt= require('jsonwebtoken');

const userSchema = require("../models/user.model");
const {usertestSchema} = require("../datavalidation/joi")

router.post('/user-signup', async(req,res)=>{
    try {
        const UserName = req.body.UserName;
        const emailid= req.body.emailid;
        const Mobilenumber = req.body.Mobilenumber;
        if(UserName && emailid && Mobilenumber ){
            let name = await userSchema.findOne({'UserName': UserName})
            let mailid = await userSchema.findOne({'emailid': emailid})
            let phonenumber= await userSchema.findOne({'Mobilenumber': Mobilenumber})
            if(name){
                return res.json({status: "failure", message: 'username already exist'})
            }
            else if(mailid){
                return res.json({status: "failure", message: 'email already exist'})
            }
            else if(phonenumber){
                return res.json({status: "failure", message: 'mobileNumber already exist'})
            }
        }else{
            return res.status(400).json({status: "failure", message: 'Must enter the username , emailid and Mobilenumber'})
        }
        const test =  await usertestSchema.validateAsync(req.body)
        let userdetail = new userSchema(req.body)
        let password=req.body.password;
        let salt = await bcrypt.genSalt(10);
        userdetail.password = bcrypt.hashSync(password, salt);
        let result = await userdetail.save();
        
        console.log("after hashing:"+ userdetail.password);
        return res.status(200).json({status: "success", message: "user details are added successfully", data: result})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({status: "failure", message: error.message})
    }
});

router.post('/user-login' , async(req,res)=>{
    try {
         let  UserName = req.body.UserName;
         let password = req.body.password;
         let userdetails;      
         let finddetails = await userSchema.findOne({UserName: UserName}).exec()
         if(UserName){
             userdetails = await userSchema.findOne({UserName: UserName }).exec()
             if(!userdetails){
                 return res.status(400).json({status: "failure", message: "please signup first"});
                }
            }else{
             return res.status(400).json({status: "failure", message: "Please enter the username"})
            }
         if(userdetails){ 
             let isMatch = await bcrypt.compare(password, userdetails.password)
             if(isMatch){  
                await userSchema.findOneAndUpdate({uuid: userdetails.uuid}, {loginStatus: true}, {new:true}).exec() 
                let payload = {uuid: userdetails.uuid, role: userdetails.role, _id: userdetails._id}
                var Data = finddetails.toObject()
                let jwttoken = jwt.sign(payload, process.env.secrectKey)
                Data.jwttoken = jwttoken  
                return res.status(200).json({status: "success", message: "Login successfully", data : Data})
               
             }else{
                 return res.status(200).json({status: "failure", message: "Incorrect password"})
             }  
            
         }
        return res.status(200).json({status : "success", messsage: "login successful", data: "result"})
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"failure", message:error.message})    
    }
 })

 router.post('/user-logout', async(req,res)=>{
    try {
      await userSchema.findOneAndUpdate({uuid: req.query.uuid}, {loginStatus: false}, {new:true}).exec()
      return res.status(200).json({status: "success", message: "Logout successfully"})
     } catch (error) {
       console.log(error.message)
       return res.status(500).json({status: "failure", message: error.message})
  }
    }
)
router.put('/forgot-passsword', async(req,res)=>{
    try {
        let UserName = req.body.UserName;
        let newpassword = req.body.newpassword;
        let userdata
        if(UserName){
            userdata = await userSchema.findOne({UserName : UserName}).exec()
            if(!userdata){
                return res.status(400).json({"status" : "process fail" , "message":"couldn't find such username, signup first"})
            }
        }else{
            return res.status(404).json({"status" : "fail", "message":"you have to enter your username to proceed further"})
        }
        if(userdata){
            console.log(userdata.password)
            console.log("newpassword"+" "+newpassword)
            let Salt= await bcrypt.genSalt(10);
            newpassword=bcrypt.hashSync(newpassword,Salt);
            console.log(newpassword)
            change = await userSchema.findOneAndUpdate({uuid : userdata.uuid} , {password : newpassword} , {new : true})
            return res.status(200).json({"status" : "success" , "message" : "password changed successfully" , "result":change})
        }  
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"failure", message:error.message}) 
    }        
})

>>>>>>> 76d7d552a4486c73ac7ebf483a9d416b14fa5f36
module.exports = router;