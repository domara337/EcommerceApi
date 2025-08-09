import db from "../config/db.js";
import { createOrder,getOrdersByUserId,findOrderById,getAllOrders,updateOrderStatus } from "../models/ordermodel.js";
import { getCartByUserId, clearCart } from "../models/cartmodel.js";



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



//get order of current user 
export const getOrders=async(req,res)=>{

try{

//get user id from req.user 
const getId=req.user.getId();


//query db for orders belonging to user 
const orders=await getOrdersByUserId(getId);

if(!orders) return res.status(404).json({message:"Orders not found"});

res.status(201).json({message: "The operation was successful" , orders: orders})




}
catch(err){



res.status(501).json({error:err.message});


}
}


//get order by id 
export const getOrderByuserId=async(req,res)=>{




    try{

        //extract order id from the req.params.id
        const orderId=req.params.id;


        const getOrder=findOrderById(orderId);




        if(!getOrder) return res.status(404).json({message:"order not found"})



        res.status(200).json(getOrder)


    }
catch(err){


res.status(501).json({error:err.message})


}




}


//get all orders 
export const getallOrders=async(req,res)=>{
    

  
    try{

          //query db for all orders
          const orders=await getAllOrders();


          if(!orders) return res.status(404).json({message:"was unable to fetch the orders"})


        //return the list of the orders 
        res.status(200).json({message:"operation was successful" , 
            orders: orders
        })





    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}



//update order status 
export const updateOrderstatus=async(req,res)=>{
    
    try{
        //extract order id from req.params.id
        const orderId=req.params.id; 

        //extract new status from the req.body 
        const newStatus=req.body.status;

        //update order status in the db 
        const Updatedstatus=await updateOrderStatus(orderId, newStatus); 

        if(!Updatedstatus) return res.status(404).json({message:"was unable to update the order status"})

        res.status(200).json({message:"Successfully updated the order status" , 
            order: Updatedstatus
        })




    }
    catch(err){
        res.status(500).json({error: err.message})
    }
}


















