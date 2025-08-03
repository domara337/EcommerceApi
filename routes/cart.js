import express from "express"; 
import { getSingleCart,
    AddItemToCart, 
    updateCartItem,
    removeItemcart, 
    clearCart
 } from "../controllers/cartController";



 const router=express.Router();




router.getSingleCart('/:id',getSingleCart)

router.post('/' , AddItemToCart);
router.put('/:id',updateCartItem);
router.delete('/:id',removeItemcart);
router.delete('/clear/:id' , clearCart);

export default router;
