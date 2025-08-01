import db from "../config/db";
import { createOrder,getOrdersByUserId,getOrderById,getAllOrders,updateOrderStatus } from "../models/ordermodel";
import { getCartByUserId, clearCart } from "../models/cartmodel";



//place a new order
export const placeOrder=async(req,res)=>{
    

    try{
    //get user id from the req.user
    const getId=req.user.getId();
    //get user cart from the db
    const getUsercart=await getCartByUserId(getId);

    //validate cart 
    if(!getUsercart || !getUsercart.items || getUsercart.items.length==0) return res.status(404).json({message:"cart not found"});

    //create new order record with cart items, total,user info 
    const order=await createOrder(getId, getUsercart.items, getUsercart.total);

    //clear user's cart after order replacement 
    if(order) {
        await clearCart(getId);
        return res.status(201).json({message:"The order was placed"})
    }

}
catch(err){
    res.status(501).json({error:err.message});
}

}







