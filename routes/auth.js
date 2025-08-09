import express from "express";
import { login, register } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router=express.Router();




//the routes
router.post('/register',register);
router.post('/login',login);
router.get('/me',authMiddleware);



export default router;