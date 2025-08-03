import express from "express"; 

import { getAllProducts,
    getProductbyId, 
    SearchProduct, 
    getProductByCategory,
    AddNewProduct, 
    updateProduct,
    deleteProduct
 } from "../controllers/productController";

 const router=express.Router();



 router.get('/',getAllProducts);
 router.get('/:id',getProductbyId);
 router.get('/category',getProductByCategory)
 router.get('/keyword',SearchProduct)

 router.post('/',AddNewProduct);
 router.put('/:id',updateProduct);
 router.delete('/:id',deleteProduct);


 export default router;