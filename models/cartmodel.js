import db from "../config/db";

//get the user cart according to the user id
export const getCartByuserId=async(userId)=>{

//query to get the cart first 
const cartResult=await db.query(
    'SELECT id FROM carts WHERE user_id=$1', 
    [userId]
)

const cartId=cartResult.rows[0].id;



  // Get cart items with product info
    const itemsResult = await db.query(
      `SELECT 
        p.id AS product_id,
        p.name,
        p.price,
        ci.quantity,
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1`,
      [cartId]
    );




return {
    items: itemsResult.rows
}



}



//create cart(userid)


export const createCart = async (userId) => {


//check if the user cart already exists 
const CartExists=await db.query(
    'SELECT id FROM carts WHERE user_id=$1',
    [userId]
)


//check if the cart exists 
if(CartExists.rows.length>0){
    return CartExists.rows[0];
}



//else, we insert new cart into the carts table '
const result=await db.query(
    'INSERT INTO carts(user_id) VALUES ($1) RETURNING *',
    [userId]
);


return result.rows[0];

};







}