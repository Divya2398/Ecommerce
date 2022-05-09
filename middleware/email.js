const nodemailer = require('nodemailer');
const ejs = require('ejs');
const {join} = require('path')

const transporter = nodemailer.createTransport({
    port : 465,
    host : "smtp.gmail.com",
    auth: {
        user : "dazzlingshinne@gmail.com",
        pass : "shineedazzling"
    }
})
async function mail_to_customer(mailData){
    try {
     const data = await ejs.renderFile(join(__dirname,'../templates/', mailData.fileName), mailData,mailData.details)
     const  maildetail = {
           from : mailData.from ,
           to : mailData.to ,
           subject : mailData.subject,
           html : data
       }
       transporter.sendMail(maildetail, (err)=>{
           if(err){
               console.log(err.message)
           }else{
               console.log("mail sent")
           }
       })
    }catch (error) {
        console.log(error.message)
        return res.status(400).json(error.message)
    }
}
module.exports = { mail_to_customer}