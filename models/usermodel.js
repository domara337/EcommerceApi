import db from "../config/db";




//write a function to find the user by the email 


export const findUserbyEmail=async (email)=>{
   //query to find the user by the email
    const result=await db.query("SELECT * FROM USERS WHERE email=$1", 
        [email]
    )

    return result.rows[0];
}



//write the function to insert into the users table
export const CreateUsers=async(email, hashed_password)=>{
    const result=await db.query("INSERT INTO users(email,password_hash) VALUES ($1,$2) RETURNING *" , 
        [email,hashed_password]
    );
    return result.rows[0];
}