import { findUserbyEmail, getUsers,CreateUsers,DeleteUser,getUserById } from "../models/usermodel.js";






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


export const updateMe = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    const allowedUpdates = ['name', 'email', 'password'];
    const updates = Object.keys(req.body);

    // Step 1: Check for invalid fields
    const isValid = updates.every(field => allowedUpdates.includes(field));
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid fields in update' });
    }

    // Step 2: Get user from DB
    const user = await getUserById(userId); // Your own DB function
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 3: Update fields
    for (let key of updates) {
      user[key] = req.body[key];
    }

    // Step 4: If password is updated, hash it (pseudo)
    if (req.body.password) {
      user.password = await hashPassword(req.body.password); // use bcrypt
    }

    // Step 5: Save to DB
    await CreateUsers(user); // Your own DB update function

    // Step 6: Return updated user (hide password)
    delete user.password;
    res.status(200).json({ user });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



//delete user
export const deleteMe=async (req,res)=>{
    //get user id from the req.user
    try{
    const userId=req.user.userId;

    //delete user from the db
    const DelUser=await DeleteUser(userId);

    //send confirmation message
    if(DelUser){
        return res.status(200).json({message:"Deleting user successful" })

    }
}
catch(err){
   return res.status(500).json({error:err.message})
}
}


//get all users
export const getAllUsers=async (req,res)=>{
    
    try{
    
    //db query to get all the users
    const users=await getUsers();

    //return the user list
     return res.status(200).json({users})

} 
catch(err){
    return res.status(500).json({error:err.message})
}
}



//get user by id(admin use)
export const findUserById=async(req,res)=>{
    try{
        //get the user id from the req.params(url-admin uses)
        const userId=req.params.id;

        //query the db for the user
        const user=await getUserById(userId);

        if(!user){
            return res.status(404).json({message:'User not found'});
  
        }


        
        //return the user info
        return res.status(200).json({user})





    }
    catch(err){
        return res.status(500).json({error:err.message})
    }
}

//delete user by id 
export const deleteUserbyId=async(req,res)=>{

  try{
    //we get the id from the req url(params)
  const userId=req.params.id;

  const DelUser=await DeleteUser(userId);

   if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

  return res.status(200).json({message:"user deleted successfuly"})
}


catch(err){
 return res.status(500).json({error:err.message}) 
}
}