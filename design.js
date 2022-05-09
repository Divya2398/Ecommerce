const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv= require('dotenv')
const userRouter = require('./routes/user.route');
const productrouter = require('./routes/product.route');
const categoryrouter = require('./routes/category.route');
const cartrouter = require('./routes/cart.route');

const design = express();
dotenv.config();
design.use(cors());
const port = process.env.PORT || 5000;

design.get("/check", async(req,res)=>{
    console.log("connected successfully")
    res.send({"status:":"reacting to request"})

    design.listen(port,() =>{
        console.log("server started at:'http://localhost:5000'")
    })
})
 // database connection

 mongoose.connect(process.env.dbUrl,{
    useNewUrlParser: true,
    useUnifiedTopology: true
 }).then(data=>{
     console.log("database connected successfully")
 }).catch(err=>{
     console.log(err.message)
     process.exit(1)
 })
 design.use(express.json());
 design.use('/v1/usermangement',userRouter);
 design.use('/v2/productapi', productrouter);
 design.use('/v3/categoryapi', categoryrouter);
 design.use('/v4/cartapi', cartrouter);

design.listen(port,() =>{
    console.log("server started at:'http://localhost:5000'")
})