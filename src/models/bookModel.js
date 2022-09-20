const mongoose  = require('mongoose')

const BookSchema = new mongoose.Schema({ 
    title: {type:String, required:true, unique: true},
    excerpt: {type:String, required:true}, 
    userId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
    ISBN: {type:String, required:true, unique: true},
    category: {type:String, required:true},
    subcategory:{type: [String,],required:true},
    reviews: {type:Number, default: 0},
    deletedAt: {type:Date}, 
    isDeleted: {type:Boolean, default: false},
    releasedAt: {type:Date, required:true,default:Date.now()},
    
  }, { timestamps: true })

module.exports = mongoose.model("Book", BookSchema)
