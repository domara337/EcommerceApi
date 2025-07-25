import db from "../config/db";
import {SingleProduct, ViewProducts,InsertProduct,DeleteProduct,UpdateProduct,SearchProduct } from "../models/productmodel";




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