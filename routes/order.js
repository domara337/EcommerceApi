import express from "express"; 


import { placeOrder, 
    getOrders, 
    getOrderById, 
    getallOrders,
    updateOrderstatus
 } from "../controllers/orderController";


 const router=express.Router();




 //place a new order
 router.post('/',placeOrder);

 //get all orders of the logged-in user
 router.get('/myorders',getOrders);


 //get a specific order by id
 router.get('/:id',getOrderById); 


 //get all orders 
 router.get('/',getallOrders);

 //update order status
 router.put('/:id/status',updateOrderstatus);


 export default router;