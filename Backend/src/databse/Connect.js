import mongoose from "mongoose";
import dotenv from 'dotenv'

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