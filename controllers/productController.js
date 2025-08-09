import db from "../config/db.js";
import {SingleProduct, ViewProducts,InsertProduct,DeleteProduct,SearchProduct, UpdateProduct } from "../models/productmodel.js";
import Joi from "joi";



export const getAllProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    let products;

    if (keyword || category) {
      products = await SearchProduct(keyword || '', category || '');
    } else {
      products = await ViewProducts();
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProductbyId = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await SingleProduct(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



//adding a new product 
export const AddNewProduct = async (req, res) => {
  try {
    // Define validation schema
    const productSchema = Joi.object({
      product_name: Joi.string().required(),
      product_description: Joi.string().required(),
      product_price: Joi.number().min(0).required(),
      product_stock: Joi.number().min(0).required(),
      product_category:Joi.string().required()
    });

    // Validate req.body
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure validated values
    const { product_name, product_description, product_price, product_stock,product_category} = value;

    // Insert into DB
    const insertion = await InsertProduct(product_name, product_description, product_price, product_stock,product_category);

    // Respond with inserted product
    res.status(201).json({ message: 'Product added successfully', product: insertion });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//updating a product 
export const updateProduct=async(req,res)=>{

/* 
Algorithim: 
1:Extract product ID from req.params.id
2:validate update data from req.body 
3:update product in db
4:return update product info 
*/

try{

const updateId=req.params.id; 





//prevent update with no fields
if(Object.keys(req.body).length===0){
  return res.status(400).json({message: 'No fields provided for update'})
}



// Define validation schema
    const updateSchema = Joi.object({
      product_name: Joi.string(),
      product_description: Joi.string(),
      product_price: Joi.number().min(0),
      product_stock: Joi.number().min(0)
    });


    //validate req.body 
    const {error, value}=updateSchema.validate(req.body);

    if(error){
      return res.status(400).json({message:error.details[0].message});
    }





    //update product 
    const updatedProduct=await UpdateProduct(updateId,value);


    if(!updatedProduct){
      return res.status(404).json({message:'Product not found or update failed'})
    }

    //if successful
    res.status(200).json({message: 'product update successfully' , product:updatedProduct});



  }
  catch(err){

 res.status(500).json({error:err.message})



  }

}



//Admin use: Delete product by id 
export const deleteProduct=async(req,res)=>{
  /*Algorithim: 
  1:Extract product id from req.params
  2:Delete record from the db using the id 
  3:return confirmation message
  */
try{
  const delId=req.params.id;

  const deleteProd=await DeleteProduct(delId);

  if(!deleteProd) return res.status(404).json({message: 'Deletion operation failed'});

  res.status(200).json({message:"product deleted"})


}

catch(err){
  res.status(500).json({error:err.message})
}
}