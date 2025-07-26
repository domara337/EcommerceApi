import db from "../config/db";
import {SingleProduct, ViewProducts,InsertProduct,DeleteProduct,UpdateProduct,SearchProduct, UpdateProduct } from "../models/productmodel";
import Joi from "joi";



//get all products 
export const getAllProducts=async (req,res)=>{
    //db query to view  all the products 
    try{
        const products=await ViewProducts();


        if(!products) return res.status(404).json({message:"Getting all products not implemented"})

            res.status(201).json({products});


    }
    catch(err){
        res.status(501).json({message:"Get all products operation failed"})
    }
}


//get a specific product with an id
export const getProductbyId=async(req,res)=>{
    try{
        const getId=req.params.getId;

        const product=await SingleProduct()

        if(!product) return res.status(404).json({message:"could not get product from the db"})

        res.status(201).json({product});
    }

    catch(err){
        res.status(501).json({error:err.message})
    }
}


//search the db using a keyword
export const SearchProduct=async(req,res)=>{
    try{
      //get the keyword from the query 
      const keyword=req.query.q;

      if(!keyword || keyword.trim()===""){
        return res.status(400).json({message:"Keyword query (?q=) is required"})
      }

      //search the db
      const result=await SearchProduct(keyword);



      //return results
      res.status(200).json({products:result.rows})







    }
    catch(err){
        res.status(501).json({error:err.message});
        
    }
}


//get products by category 
export const getProductByCategory=async(req,res)=>{


    try{
    const category=req.params.category;

    const getCategory=await getProductByCategory(category);

    if(!getCategory) return res.status(401).json({message: "getting category operation failed"})

        res.status(201).json({message:"operation successful"});
}

catch(err){

res.status(501).json({error:err.message})


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
      product_stock: Joi.number().min(0).required()
    });

    // Validate req.body
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Destructure validated values
    const { product_name, product_description, product_price, product_stock } = value;

    // Insert into DB
    const insertion = await InsertProduct(product_name, product_description, product_price, product_stock);

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
    const updatedProduct=await updateProduct(updateId,value);


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