import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
    const con = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected succesfully : ${con.connection.host}`);
    }
    catch(err){
        console.log("Data Base connection failure : ", err);
        process.exit(1);
    }
}