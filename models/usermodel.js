import db from "../config/db";




//write a function to find the user by the email 


export const findUserbyEmail=async (email)=>{
   //query to find the user by the email
    const result=await db.query("SELECT * FROM users WHERE email=$1", 
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


//write the function to get all the users 
export const getUsers=async()=>{
    //query to get all the users
    const result=await db.query("SELECT * FROM users");
    return result.rows;
}


//write the function to delete the user by id
export const DeleteUser=async(id)=>{
    //query to delete the user by id
    const result=await db.query("DELETE FROM users WHERE id=$1 RETURNING *",
        [id]
    )
    return result.rows[0];
}


export const getUserById=async(id)=>{
    //query to select the user according to an id
    const result=await db.query("SELECT * FROM users WHERE id=$1", 
        [id]
    )
    return result.rows[0];
}


export const updateUserbyId=async(id,updates)=>{
    
    //getting the keys of the update field "ex:name"
    const fields=Object.keys(updates);
    //setting the values of the keys to values variable
    const values=Object.values(updates);

    //build set Clause dynimacally 
    const setClause=fields.map((field,index)=>`${field}=$${index+1}`).join(', ');

    //write the query dynimacally
    const query=`UPDATE users SET ${setClause}
    WHERE id=$${fields.length+1} RETURNING *`;

    const result=await db.query(query, [...values, id]);
    return result.rows[0]
}