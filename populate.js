
require('dotenv').config()
const connectDB = require('./db/connect')
const Productmodel = require('./models/product')
const jsonProducts = require('./products.json')


const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      await Productmodel.deleteMany()
      await Productmodel.create(jsonProducts)
      console.log('baby boy')
      process.exit(0)
   } catch (error) {
    console.log(error) 
    process.exit(1)
   }
}

start()
