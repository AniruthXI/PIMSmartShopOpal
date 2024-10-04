import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Successfilly connected to Opal mongoDB`);
    } catch (error){
        console.log(`ERROR: ${error.message}`);
        process.exit(1)
    }
}

export default connectDB;