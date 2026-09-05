import mongoose from "mongoose";
// import mangoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://mohammadsakib7151_db_user:7xXLeMNSuGQjBJg3@cluster0.m7zo6rt.mongodb.net/food-del').then(() =>console.log("DB Connected"));

}