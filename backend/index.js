import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import ecomRouter from "./routes/ecomRoutes.js"
import productRouter from "./routes/productRoutes.js"
import cookieParser from "cookie-parser"
import Multer from 'multer' //
import { v2 as cloudinary } from 'cloudinary' //

const corsOptions = {
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // This allows the server to accept cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allowed methods
    
};

const PORT=process.env.PORT || 5000
const app=express()
dotenv.config(); // 
//app.use(cors({origin:"*"}))
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", ecomRouter)
app.use("/api/product", productRouter);

const storage = new Multer.memoryStorage();
const upload = Multer({
    storage,
}); //

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
}); //
async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
} //

app.post("/upload", upload.single("my_file"), async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        res.json(cldRes);
    } catch (error) {
        console.log(error);
        res.send({
            message: error.message,
        });
    }
});

try {
    // MongoDB URI with localhost (creates the DB automatically when data is inserted)
    await mongoose.connect(`mongodb://127.0.0.1:27017/Ecommerce`)

    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
} 
catch(error) {
    console.log(error)
}

app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
})