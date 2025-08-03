import express from "express"; 

import { getMe,updateMe,deleteMe,getAllUsers,findUserById,deleteUserbyId } from "../controllers/userController";

const router=express.Router();




router.get('/', getMe);
router.put('/update',updateMe);
router.delete('/delete',deleteMe);
router.get('/getall',getAllUsers);
router.get('/:id',findUserById);
router.delete('/:id',deleteUserbyId);




export default router;