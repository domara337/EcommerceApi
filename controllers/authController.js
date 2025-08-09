import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserbyEmail, CreateUsers } from '../models/usermodel.js';


const saltedRounds=10;
//create register logic
export const register=async (req,res) =>{

//get the email and password from the req.body
const {email, password,name} =req.body;

try{
//check if the email is available in the database using the userModel database query
const existing=await findUserbyEmail(email);
//if(existing) return status 400 and a json message of user already exists
if (existing) return res.status(400).json({message: 'user arleady exists'})

//hash the password using the bycrypt hash method
const hashedPassword=await bcrypt.hash(password,saltedRounds);
//create a new user and insert into the database using the create user db query
const newUser=await CreateUsers(email ,hashedPassword,name);

//return a status of 201 and a json of id and email
res.status(201).json({id: newUser.id, email: newUser.email})

}
//catch err
catch(err){
    res.status(500).json({error:err.message})
}
//return a status of 500 and json error message





}

//login logic route
export const login=async (req,res)=>{


//get the email and password from the req body
const {email, password} =req.body;
try{
//search the database for the email 
const user=await findUserbyEmail(email);
//if(!user) return a res status of 401 and a json message of invalid credentials
if(!user) return res.status(401).json({message: 'Invalid user'})
//match the password we get from the req.body with the password we have in the database
const match= await bcrypt.compare(password, user.password_hash);
//if(!match) return a status of 401 and a json message of invalid crendentials 
if(!match) return res.status(401).json({message: 'Invalid credentials'})

//create and sign a jwt token(takes 3 parameters(userId, jwt_secret(generate it in the terminal) , and expiry time))
//res.json({token})
const token=jwt.sign({userId: user.id},process.env.JWT_SECRET, {expiresIn: '1h'})
res.json({token})
//catch (err)
}
catch(err){
    res.status(500).json({error: err.message})
}
//return a status of 500 and a json message of error

}



