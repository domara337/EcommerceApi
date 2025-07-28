import db from '../db/yourDb.js'; // adjust to your DB connection file

// Get the user's cart and items
export const getCartByUserId = async (userId) => {
  
  
  //check if the user cart exists 
  const cartRes = await db.query('SELECT * FROM carts WHERE user_id = $1', 
    [userId]
  );
  
  
  
  if (cartRes.rows.length === 0) return null;

  const cart = cartRes.rows[0];

  const itemsRes = await db.query(`
    SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = $1
  `, [cart.id]);

  const items = itemsRes.rows;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return { cartId: cart.id, items, total };
};

// Create a cart for a user
export const createCart = async (userId) => {
  const res = await db.query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId]);
  return res.rows[0];
};

// Add or update an item in the cart
export const addOrUpdateCartItem = async (userId, productId, quantity) => {
  // 1. Get or create cart
  let cart = await getCartByUserId(userId);
  if (!cart) {
    cart = await createCart(userId);
  }

  // 2. Check if item exists
  const itemRes = await db.query(
    'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
    [cart.cartId || cart.id, productId]
  );

  if (itemRes.rows.length > 0) {
    // Update quantity
    await db.query(
      'UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3',
      [quantity, cart.cartId || cart.id, productId]
    );
  } else {
    // Insert new item
    await db.query(
      'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
      [cart.cartId || cart.id, productId, quantity]
    );
  }
};

// Update quantity of an existing item
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await getCartByUserId(userId);
  if (!cart) throw new Error('Cart not found');

  await db.query(
    'UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3',
    [quantity, cart.cartId, productId]
  );
};

// Remove item from cart
export const removeCartItem = async (userId, productId) => {
  const cart = await getCartByUserId(userId);
  if (!cart) throw new Error('Cart not found');

  await db.query(
    'DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2',
    [cart.cartId, productId]
  );
};

// Clear all items from cart
export const clearCart = async (userId) => {
  const cart = await getCartByUserId(userId);
  if (!cart) throw new Error('Cart not found');

  await db.query(
    'DELETE FROM cart_items WHERE cart_id = $1',
    [cart.cartId]
  );
};
