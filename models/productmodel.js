import db from "../config/db.js";

// 1. View all products
export const ViewProducts = async () => {
    const result = await db.query("SELECT * FROM products");
    return result.rows;
};

// 2. Get single product by ID
export const SingleProduct = async (product_id) => {
    const result = await db.query(
        "SELECT * FROM products WHERE id = $1",
        [product_id]
    );
    return result.rows[0];
};

// 3. Insert a new product
export const InsertProduct = async (
    product_name,
    product_description,
    product_price,
    product_stock,
    category_id,
    product_createdAt
) => {
    const result = await db.query(
        `INSERT INTO products (name, description, price, stock, category_id, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
            product_name,
            product_description,
            product_price,
            product_stock,
            category_id,
            product_createdAt
        ]
    );
    return result.rows[0];
};

// 4. Delete product by ID
export const DeleteProduct = async (product_id) => {
    const result = await db.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [product_id]
    );
    return result.rows[0]; // return the deleted product
};

// 5. Update product by ID
export const UpdateProduct = async (
    product_id,
    product_name,
    product_description,
    product_price,
    product_stock,
    category_id
) => {
    const result = await db.query(
        `UPDATE products 
         SET name = $1, 
             description = $2, 
             price = $3, 
             stock = $4, 
             category_id = $5 
         WHERE id = $6 
         RETURNING *`,
        [
            product_name,
            product_description,
            product_price,
            product_stock,
            category_id,
            product_id
        ]
    );
    return result.rows[0];
};
