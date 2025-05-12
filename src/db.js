import mongoose from "mongoose";


export const connectDb = async () => {
    try {
      //await mongoose.connect("mongodb://localhost/pruebaproye");
      await mongoose.connect("mongodb+srv://rcastellanosl:HgeHcwUuONiYMZYy@proyecto.cikwcwk.mongodb.net/?retryWrites=true&w=majority&appName=Proyecto");
        console.log(">>> db is connected");
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};