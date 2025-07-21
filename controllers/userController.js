import { findUserbyEmail, getUsers,CreateUsers,DeleteUser,getUserById } from "../models/usermodel";






export const getMe=async(req,res)=>{
    
    
    try{
    //get user id from the req.user
    const getId=req.user.userId;

    //db query to get the user by id
    const user=await getUserById(getId);

    if(!user){
        return res.status(404).json({message:'User not found'});
    }
    return res.status(200).json({user})
}

catch(err){
res.status(500).json({error:err.message})
}
}


export const updateMe=async(req,res)=>{
    //get user id from the req.user
    const getId=req.user.userId;

    //validate incoming update data
    
}