import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/ClerkWebhook.js"
import userRouter from "./routes/userRoute.js"
import connectCloudinary from "./config/clodinary.js"
import addressRouter from "./routes/addressRoute.js"
import cartRouter from "./routes/cartRoute.js"


await connectDB() //Establish connection to the database
await connectCloudinary //setup cloudinary for image storage


const app = express()  // initialize express application
app.use(cors()) //enable cross-Origin resource sharing

//middleware setup
app.use(express.json()) // enables json request body parsing
app.use(clerkMiddleware())

// API to listen clerk wwebhooks
app.use("/api/clerk", clerkWebhooks)

// define API Routes
app.use('/api/user', userRouter) // routes for user functionality
app.use('/api/products', userRouter) // routes for handling products
app.use('/api/addresses', addressRouter) // routes for handling addresses
app.use('/api/cart', cartRouter) // routes for handling cart

// Route endpoint to check API status
app.get('/', (req, res) => {
    res.send("API Successfully connected")
})

const port = process.env.PORT || 3000 //define server port

//start the server
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`))