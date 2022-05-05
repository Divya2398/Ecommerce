const router = require('express').Router();
const cartSchema= require('../models/cart.model')
const { authverify } = require('../middleware/auth')

router.post('/cart-add-product', authverify, async(req,res)=>{
    try {
      const cart = new cartSchema({
          useruuid: req.body.useruuid,
          cartItems: req.body.cartItems
      })
      const result = await cart.save();
      return res.status(200).json({"status":"success", "message": "product is added to cart", "result":result})

    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure' ,'message': error.message })
    }
})               

router.post("/cart-add", async (req, res) => {
    const useruuid = req.query.useruuid 
    const { productuuid, productName, quantity , price } = req.body;
    try {
      const cartdetail = new cartSchema(req.body)
      let cart = await cartSchema.findOne({useruuid});
      if (cart) {
        let itemIndex = cart.cartItems.findIndex(p => p.productuuid == productuuid);
        console.log("itemIndex=",itemIndex)
        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.cartItems[itemIndex];
          console.log("productItem=",productItem)
          productItem.quantity = quantity;
          productItem.price = price * productItem.quantity
          cart.cartItems[itemIndex] = productItem ;
          console.log("cart=",cart.cartItems[itemIndex])

        } else {
          cart.cartItems.push({ productuuid, productName,  quantity, price });
        }
        cart = await cart.save();cc
        return res.status(201).json({"status":"success", "message":"products added to cart","result":cart});
      } else {
        const newCart = await cartSchema.create({
          useruuid,
          cartItems: [{ productuuid, productName, quantity, price }]
        });
        return res.status(201).json({status: "success","message":"cart created", "result":newCart});
      }
    } catch (error) {
      console.log(error);
     return res.status(500).json({"message": error.message});
    }
  });


  router.post('/delete-cart',async(req,res)=>{
    try {
       // console.log(req.query.uuid)
        await cartSchema.findOneAndDelete({uuid: req.body.uuid}).exec();
        return res.status(200).json({'status': 'success', message: " cart is deleted successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({"status": 'failure', 'message': error.message})
    }
})

//router.post('/cart-add', authverify, async(req,res)=>{
//     const useruuid = req.body.useruuid;
//     const cartItems = req.body.cartItems;
//     try {
//         const cart = new cartSchema(req.body);
//         const user = await cartSchema.findOne({useruuid});
//         if(user){
//           const product = cartItems.productuuid;
//           let newquantity = cartItems.quantity;
//           let findcart = cart.cartItems.find(c => c.productuuid == product);
//           if(findcart){
//              let update = cartSchema.findOneAndUpdate({"useruuid" : req.body.useruuid, "cartItems.productuuid":product,"cartItems.quantity" : (findcart + newquantity)})
//              .exec((error,_cart) =>{
//                  if(error){
//                      return res.status(400).json({"message":error.message})
//                  }if(_cart){
//                      return res.status(200).json({"result":_cart})
//                  }
//              })
//           }else{
//               let newupdate = cartSchema.findByIdAndUpdate({"useruuid":req.body.useruuid },{
//                   "$push":{
//                       "cartItems": req.body.cartItems
//                   }
//               })
//               .exec((error,_cart) =>{
//                 if(error){
//                     return res.status(400).json({"message":error.message})
//                 }if(_cart){
//                     return res.status(200).json({"result":_cart})
//                 }
//             })   
//           }
//         }else{
//             const newcart = new cartSchema(req.body)
//             const result = await newcart.save();
//             return res.status(200).json({"status":"success", "message": "product is added to cart", "result":result})
//         }
//     } catch (error) {
//         console.log(error.message);
//         return res.status(400).json({"status": 'failure' ,'message': error.message })
//     }
// })
  
module.exports = router;