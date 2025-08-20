import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") }); // always loads from root


dotenv.config()

const ConnectDb=async ()=>{
try{
    const connection =await mongoose.connect(process.env.MONGODB_URI,{
    });
    console.log(`Database connected successfully ${connection.connection.host}`);
}catch(Err){
    console.log("Error in connecting to the database",Err);
}}

export default ConnectDb;