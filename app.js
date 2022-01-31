
const express = require('express')
require('dotenv').config()
require('express-async-errors')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
   res.send('<h1>Home Page</h1> <a href="/api/v1/products">Products</a>')
})

app.use('/api/v1/products', productsRouter)

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const Port = 3000

const start = async () => {
    try {
        // connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(Port, console.log(`Server is listening on ${Port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()


