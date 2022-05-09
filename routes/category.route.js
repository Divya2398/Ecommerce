<<<<<<< HEAD
const router = require('express').Router();
const joi = require('joi');
const { Admin } = require('../middleware/auth');
const categorySchema = require('../models/category.model');
const {  categorytestSchema } = require('../datavalidation/joi')

router.post('/add-category',Admin, async(req,res)=>{
    try {
        const test = await categorytestSchema.validateAsync(req.body)
        const add = new categorySchema(req.body)
        const result = await add.save();
        return res.status(200).json({"status": "succes", "message":"categories are added", "result":result})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure' ,'message': error.message })
    }
})

router.delete('/delete-category',Admin, async(req,res)=>{
    try {
       // console.log(req.query.uuid)
        await categorySchema.findOneAndDelete({uuid: req.query.uuid}).exec();
        return res.status(200).json({'status': 'success', message: "category is deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

=======
const router = require('express').Router();
const joi = require('joi');
const { Admin } = require('../middleware/auth');
const categorySchema = require('../models/category.model');
const {  categorytestSchema } = require('../datavalidation/joi')

router.post('/add-category',Admin, async(req,res)=>{
    try {
        const test = await categorytestSchema.validateAsync(req.body)
        const add = new categorySchema(req.body)
        const result = await add.save();
        return res.status(200).json({"status": "succes", "message":"categories are added", "result":result})
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure' ,'message': error.message })
    }
})

router.delete('/delete-category',Admin, async(req,res)=>{
    try {
       // console.log(req.query.uuid)
        await categorySchema.findOneAndDelete({uuid: req.query.uuid}).exec();
        return res.status(200).json({'status': 'success', message: "category is deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

>>>>>>> 76d7d552a4486c73ac7ebf483a9d416b14fa5f36
module.exports = router;