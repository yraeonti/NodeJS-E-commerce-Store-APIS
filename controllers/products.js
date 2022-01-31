const ProductModel = require('../models/product')


const getAllProductsStatic = async (req, res) => {
     const Products = await ProductModel.find({}).sort('name').select('name price')
     res.status(200).json({Products, nbHits: Products.length})
}

const getAllProducts = async (req, res) => {
    const {featured, company, name, sort, fields, numericFilters} = req.query
    const queryObject = {}

    if (featured) {
     queryObject.featured = featured === 'true' ? true : false
    }
    if (company) {
     queryObject.company = company
    }
    if (name) {
         queryObject.name = {$regex: name, $options: 'i'}
    }
    if (numericFilters) {
         const operatorMap = {
              '>': '$gt',
              '>=': '$gte',
              '=': '$eq',
              '<': '$lt',
              '<=': '$lte'
         }
         const regEx = /\b(<|>|>=|=|<|<=)\b/g
         let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)

         const options = ['price', 'rating']
         filters = filters.split(',').forEach( (item) => {
             const [field, operator, value] = item.split('-')
             if (options.includes(field)) {
                 queryObject[field] = {[operator]: Number(value)}
             }
         });  

    }
     console.log(queryObject)
     let result = ProductModel.find(queryObject)
     if (sort) {
          const sortlist = sort.split(',').join(' ')
          result = result.sort(sortlist)
     }
     if (fields) {
          const fieldslist = fields.split(',').join(' ')
          result = result.select(fieldslist)
     }
     
     const page = req.query.page ? Number(req.query.page) : 1
     const limit = Number(req.query.limit) || 10 
     const skip = (page - 1) * limit
      result = result.skip(skip).limit(limit)

     const Products = await result

     res.status(200).json({Products, nbHits: Products.length}) 
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}