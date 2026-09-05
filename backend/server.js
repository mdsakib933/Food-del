import express from "express"
import cors from "cors"
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app config
const app = express()
const port = process.env.PORT || 4000;

//middleware
app.use(express.json())
app.use(cors())

//db connection
// connectDB();

//api endpoints
app.use("/api/food",foodRouter)
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

// app.listen(port,()=>{
//     console.log(`Server Started on http://localhost:${port}`)
// })

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server Started on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log("Database connection failed:", error);
    });

//mongodb://mohammadsakib7151_db_user:7xXLeMNSuGQjBJg3@ac-aooq5y8-shard-00-00.m7zo6rt.mongodb.net:27017,ac-aooq5y8-shard-00-01.m7zo6rt.mongodb.net:27017,ac-aooq5y8-shard-00-02.m7zo6rt.mongodb.net:27017/?
//mongodb+srv://mohammadsakib7151_db_user:7xXLeMNSuGQjBJg3@cluster0.m7zo6rt.mongodb.net/?appName=Cluster0