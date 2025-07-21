import bcrypt, { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserbyEmail, CreateUsers } from '../models/usermodel';
const saltedRounds=10;


//register logic
export const register=async(req,res)=>{

const {email, password}=req.body;

try{
const exists=await findUserbyEmail(email);


if(exists) return res.status(400).json({message:'User already exists'});



const hashed_password=bcrypt(password); 

const newUser=await CreateUsers(email, hashed_password);

res.status(201).json({id:newUser.id, email: newUser.email});
}catch(err){
    res.status(500).json({error: err.message})
}
}



//login logic
export const login=async(req,res)=>{

const {email , password}=req.body;

try{
const exists=findUserbyEmail(email);


if(!exists) return res.status(401).json({message: 'User doesnt exist'})


const match=bcrypt.compare(password, hashed_password);

if(!match) return res.status(401).json({message:"Invalid credentials"});

//create and sign a jwt token(takes 3 parameters(userId, jwt_secret(generate it in the terminal) , and expiry time))
//res.json({token})

const token=jwt.sign({userId:newUser.id},process.env.JWT_SECRET,{expiresIn:'1h'});
res.json({token})






}

catch(err){
    res.status(500).json({error:err.message})
}



}


