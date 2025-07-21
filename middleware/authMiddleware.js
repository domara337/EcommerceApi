import jwt from 'jsonwebtoken';


const authMiddleware=async (req,res,next)=>{

//get the authorization type of the req.headrers

const authHeader=req.headers['authorization'];


//if the authenticaiton header is not found
if(!authHeader || !authHeader.startsWith('Bearer ')){
    //return an  error message
    return res.status(401).json({message: 'missing token'})

}
    //extract the token in "bearer <token>" format
    const token=authHeader.split(' ')[1];


    try{
        //verify the token using the secret key
        const decoded=jwt.verify(token, process.env.JWT_SECRET);


        
        //attach the decoded user information to the request object
        req.user=decoded;
        next();
    }

catch(err){

    return res.status(403).json({message: 'Invalid or expired token'})
}
}

export default authMiddleware;

















