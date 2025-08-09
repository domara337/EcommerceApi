import express from "express"; 

import { getMe,updateMe,deleteMe,getAllUsers,findUserById,deleteUserbyId } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router=express.Router();




router.get('/', getMe);
router.put('/update',updateMe);
router.delete('/delete',authMiddleware,deleteMe);
router.get('/getall',getAllUsers);
router.get('/:id',findUserById);
router.delete('/:id',deleteUserbyId);




export default router;