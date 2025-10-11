import express from "express"
import cors from "cors"
import "dotenv/config"


const app = express()  // initialize express application
app.use(cors()) //enable cross-Origin resource sharing

// Route endpoint to check API status
app.get('/', (req, res) => {
    res.send("API Successfully connected")
})

const port = process.env.PORT || 3000 //define server port

//start the server
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`))