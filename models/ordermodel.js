import db from "../config/db";



export const createOrder = async (userId, cartItems, totalAmount) => {
  // Insert a new order and its items in the DB inside a transaction

  try {
    await db.query('BEGIN');

    // 1. Insert into orders table
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount, status, created_at)
       VALUES ($1, $2, 'pending', NOW())
       RETURNING id`,
      [userId, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // 2. Insert each item into order_items table
    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    await db.query('COMMIT');

    return orderId;

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};


export const getOrdersByUserId = async (userId) => {
  const result = await db.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};



export const getOrderById = async (orderId) => {
  // Get order details and items

  const orderResult = await db.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null; // order not found
  }

  const order = orderResult.rows[0];

  const itemsResult = await db.query(
    `SELECT * FROM order_items WHERE order_id = $1`,
    [orderId]
  );

  order.items = itemsResult.rows;

  return order;
};




export const getAllOrders = async () => {
  const result = await db.query(
    `SELECT * FROM orders ORDER BY created_at DESC`
  );
  return result.rows;
};




export const updateOrderStatus = async (orderId, newStatus) => {
  const result = await db.query(
    `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
    [newStatus, orderId]
  );

  if (result.rows.length === 0) {
    return null; // order not found
  }

  return result.rows[0];
};





