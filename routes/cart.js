import express from "express"; 
import { getSingleCart,
    AddItemToCart, 
    updateCartItem,
    removeItemcart, 
    clearcart
 } from "../controllers/cartController.js";



 const router=express.Router();




router.get('/:id',getSingleCart)

router.post('/' , AddItemToCart);
router.put('/:id',updateCartItem);
router.delete('/:id',removeItemcart);
router.delete('/clear/:id' , clearcart);

export default router;
