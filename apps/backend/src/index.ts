/// <reference path="./types/express.d.ts" />
import express from "express";
import { connectDB } from "db";
import { config } from "dotenv";
import cors from "cors"
config();

import authRoutes from "./routes/Auth.js"
import folderRoutes from "./routes/Folder.js"
import imageRoutes from "./routes/Image.js"
import { JWTMiddleware } from "./middleware/JWTMiddleware.js";


// connecting to the db
connectDB();

const app = express();

// body parser
app.use(express.json())
// CORS
app.use(cors());



// Routes
// public route
app.use('/api/auth', authRoutes);
// protected route 
app.use('/api/folder', JWTMiddleware, folderRoutes);
app.use('/api/image', JWTMiddleware, imageRoutes);


app.get("/", (req, res) => {
    return res.json({
        message: "server is up and running"
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});


