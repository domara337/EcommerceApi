import db from "../config/db.js";
import { getCartByUserId,createCart,addOrUpdateCartItem,updateCartItemQuantity,removeCartItem,clearCart } from "../models/cartmodel.js";




//get cart by user id
export const getSingleCart=async(req,res)=>{
    try{

        const getUserId=req.user.userId;

        const cart=await getCartByUserId(getUserId);

        if(!cart) return res.status(401).json({message:"Cart not found"});


        res.status(201).json({items: cart.items, total: cart.total })







    }
    catch(err){

        res.status(501).json({error: err.message});
    }
}


//add item to cart 
export const AddItemToCart = async (req, res) => {
  try {


    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    // Get the user's cart
    let cart = await getCartByUserId(userId);

    // If no cart, create one
    if (!cart) {
      const createdCart = await createCart(userId);
      cart = { id: createdCart.id }; // match expected shape
    }

    // Add or update the cart item
    await addOrUpdateCartItem(userId, productId, quantity);

    // Optionally: get the updated cart to return
    const updatedCart = await getCartByUserId(userId);

    res.status(200).json({
      message: "Item added/updated successfully",
      cart: updatedCart
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


//update item quantity in cart 
export const updateCartItem=async(req,res)=>{
    try{
    //get user id
    const getuserid=req.user.userId;
    //get product id, quantity from the req.body
    const {productId, quantity}=req.body;

    //get the cart for the user id
    const cart=await getCartByUserId(getuserid);
     if(!cart) return res.status(404).json({message:"Cart not found"})



    //update the quantity according to the cart
    const updatedItem=await updateCartItemQuantity(cart.id,quantity,productId);

    //return the updatedCart
    const updatedCart=await getCartByUserId(getuserid);




    res.status(200).json({
        message:"Item quantity update operation successful",
        cart:updatedCart
    })


    }
    catch(err){
        return res.status(501).json({error:err.message});
    }
}


//remove cart item
export const removeItemcart=async(req,res)=>{
  
  
    try{
    const productId=req.params.id;
    const userId=req.user.userId;


    //fetch the user cart(to remove the cart item)
    const cart=await getCartByUserId(userId);

    //check if cart exists
    if(!cart) return res.status(404).json({message:"Cart not found"})


    //remove item from cart 
    const RemovedItem=await removeCartItem(userId,productId);

    if(!RemovedItem) return res.status(404).json({message:"Operation Removing failed"});

    res.status(200).json({message: "operation successful"});
}
catch(err){
res.status(500).json({error:err.message});
}
}


//clear cart 
export const clearcart=async(req,res)=>{
  try{
    const userId=req.user.userId;

    const clearedCart=clearCart(userId);


    if(!clearedCart) return res.status(404).json({message:"Clearing cart operation failed"})

    res.status(200).json({message:"Operation successful"});



  }
  catch(err){
    res.status(501).json({error:err.message});
  }
}