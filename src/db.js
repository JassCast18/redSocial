import mongoose from "mongoose";


export const connectDb = async () => {
    try {
      await mongoose.connect("mongodb://localhost/pruebaproye");
        console.log(">>> db is connected");
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};