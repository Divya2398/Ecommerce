const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');


const productSchema = require('../models/product.model')
const {producttestSchema} = require('../datavalidation/joi')
const categorySchema = require('../models/category.model')
const {Admin} = require('../middleware/auth');
const { authverify } = require('../middleware/auth')
const store = require("../middleware/multer");
const path =require('path');
const upload = multer({storage : store.storage});


router.post('/add-product',Admin, async(req,res)=>{
    try{
        const newproduct =  await  producttestSchema.validateAsync(req.body)
        const data = new productSchema(req.body);
        const result = await data.save();
        return res.status(200).json({'status': 'products added successfully', "result": result})
    }catch(error){
        console.log(error.message);
        return res.status(400).json({"status": 'it is a failure' ,'message': error.message })
    }
}); 

router.delete('/delete-product',Admin, async(req,res)=>{
    try {
       // console.log(req.query.uuid)
        await productSchema.findOneAndDelete({uuid: req.query.uuid}).exec();
        return res.status(200).json({'status': 'success', message: " details of product is deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

router.put('/update-product',Admin , async(req,res)=>{
    try {
        change = req.body.change
        const update = await productSchema.findOneAndUpdate({uuid: req.body.uuid} , change, {new:true} )
        return res.status(200).json({'status':'success', "message":"product detail are updated successfully,","result":update})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

router.get('/get-allproduct',async(req,res)=>{
    try {
        products = await productSchema.find().exec();
        if(products){
            return res.status(200).json({"message" : "all products are shown", "result" : products})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

//category based product
router.get('/cat-based-product', async(req,res)=>{
    try {
        productdetail = await categorySchema.aggregate([
            {
                $match:{
                    uuid:req.query.uuid
                }
            },
            {
                "$lookup":{
                    from:"products",
                    localField:"uuid",
                    foreignField:"categoryuuid",
                    as:"product"
                },
            },
            {
                
                    $unwind:{    
                        path:"$product",
                        preserveNullAndEmptyArrays:true
                    }
                
            },
            {
                $project:{
                    "_id":0,
                    "categoryName":1,
                    "product.productName":1,
                    "product.Description":1,
                    "product.price":1
                 }
            }
        ])
        if(productdetail){
            return res.status(200).json({"status":"success","message":"products fetched successfully ", "result":productdetail})
        }else{
            return res.status(400).json({"status":"no product found under this category"})
        }
        
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message}) 
    }
})
//filter
router.get('/filter-price',authverify, async(req,res)=>{ 
    try {
        let minprice = req.query.minprice
        let maxprice = req.query.maxprice
        let min = parseInt(minprice)
        let max = parseInt(maxprice)
        console.log(minprice)

        const pricefilter = await productSchema.aggregate([
            {
                $match:{
                    price:{
                        $gte:min,
                        $lte:max
                    }
                    
                }
            }
        ])
        console.log("product=", pricefilter)
        if(pricefilter !== null){
            return res.status(200).json({"status":"success","message":"products fetched successfully ", "result":pricefilter})
        }else{
            return res.status(400).json({"status":"no product found under this price interval"})
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})  
    }
})

router.get('/search-productname',authverify, async(req,res)=>{
    try {
        const find_product = await productSchema.findOne({productName : req.query.productName}).exec()
        if(find_product){
            return res.status(200).json({"status":"success", "message": "product is fetched","result": find_product}) 
        }else{
            return res.status(200).json({"status":"success", "message": "product is fetched","result": find_product}) 
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message}) 
    }
})

router.get("/search-product", async (req, res) => {
    // create  object to hold search value 
    const find_product = {};
    // assign search value to find_product.productName
    if (req.query.search) {
        find_product.productName = {
            $regex: req.query.search,
            $options: 'i'
        };
    }
    try {
        let products = await productSchema.find(find_product).select('productName  Description price');
         return res.status(200).json({"status":"success", "result":products});

    } catch (error) {
        console.log(error)
        return res.status(500).json('Error to get products', error.message)
    }
})
// read bulkdata and upload bulk data in db
router.post("/bulk-upload",upload.single('file'), async(req,res)=>{
    try {
        let path = './uploads/'+ req.file.filename;
        console.log("path=", path)
        let datas = xlsx.readFile(path);
        let sheetname = datas.SheetNames
        console.log("sheetname=", sheetname)
        console.log("_".repeat(100))
        let resultdata = xlsx.utils.sheet_to_json(datas.Sheets[sheetname[0]]);
        //console.log(resultdata)
        console.log("".repeat(100))
        for(const x of resultdata){
            //console.log(x)
            console.log("".repeat(100))
            const finddata = await productSchema.findOne({productName:x.productName})
            if(finddata){
                updatedata = await productSchema.findOneAndUpdate({productName:x.productName},{quantity:finddata.quantity+x.quantity},{new:true})
                //console.log("product already exist")
            }else{
            const data = new productSchema(x);
            const result = await data.save();
            console.log(result)
        }
         }
        return res.status(200).json({"status":"success","message":" upload process completed"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "failure", message: error.message}) 
    }
})
module.exports = router;

