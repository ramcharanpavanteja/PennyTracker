import jwt from "jsonwebtoken";

export const generate_token = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn:"1d"});
};
