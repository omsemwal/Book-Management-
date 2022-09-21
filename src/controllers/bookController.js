const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');
const reviewmodel = require("../models/reviewModel")



 const createBook =  async function (req, res) {
    try {

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.send({ status: false, msg: "for registration user data is required" })
        }

        if (!title) {
            return res.status(400).send({ status: false, msg: "title must be present" })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "excerpt must be present" })
        }


        if (!userId) {
            return res.status(400).send({ status: false, msg: "userId must be present" })
        }

        if (!(req.body).userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, msg: "Please Enter Valid user Id " })
            }
        }
            if (!ISBN) {
                return res.status(400).send({ status: false, msg: "ISBN must be present" })
            }

            if (!category) {
                return res.status(400).send({ status: false, msg: "category must be present" })
            }

            if (!subcategory) {
                return res.status(400).send({ status: false, msg: "subcategory must be present" })
            }

            if (!releasedAt) {
                return res.status(400).send({ status: false, msg: "releasedAt must be present" })
            }

            //--------------------------------------------------------------------------------------------------

            let existtitle = await bookModel.findOne({ title: title })
            if (existtitle) {
                return res.send({ status: false, msg: "This title is already exist" })
            }


            let existISBN = await bookModel.findOne({ ISBN: ISBN })
            if (existISBN) {
                return res.send({ status: false, msg: "ISBN is already exist" })
            }

            let getBookData = await bookModel.create(req.body);
            return res.status(201).send({ status: true, data: getBookData });


        } catch (err) {
            res.status(500).send({ status: false, msg: err.message });
        }
    }


    const getBook = async function (req, res) {

        requestQuery = req.query
    
        let { userId, category, subcategory } = requestQuery
    
    
        if (Object.keys(requestQuery).length == 0) {
            let book = await bookModel.find({ isDeleted: false }).select({ book_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, })
            if (book) {
                return res.status(200).send({ status: true, data: book })
            } else {
                return res.status(404).send({ status: false, msg: "not a valid request" })
    
            }
        }
        let final = await bookModel.find({ $in:[{ userId: userId, category: category, subcategory: subcategory }] }, { isDeleted: false })
        if (!final) {
            return res.status(404).send({ status: false, msg: "data not found" })
        } else {
            return res.status(200).send({ status: true, data: final })
        }
    
    
    
    
    }
    



    const getbooksbyid = async (req,res)=>{
        try {
            let bookid1 = req.params.bookId
            // if(bookid1.length==0)return res.status(400).send({status:false,msg:"please give book id"})
            if(!mongoose.Types.ObjectId.isValid(bookid1))return res.status(400).send({status:false,msg:"please enter valid bookid"})
            
            let book = await bookModel.find({_id:bookid1,isDeleted:false})
            // book=book.toObject()
            console.log(book)
            if(!book)return res.status(404).send({status:false,msg:"no such books present"})
            //  book =book.toObject()
            // console.log(book)
            let review = await reviewmodel.find({bookId:bookid1})
            
            // book["review"] =review

            return res.status(200).send({status:true,data:book})
        } catch (error) {
            res.status(500).send({ status: false, msg: error.message });
    }
        
    }


    
    // module.exports .getbooksbyid=getbooksbyid
    

module.exports.createBook =createBook
module.exports .getbooksbyid=getbooksbyid
module.exports .getBook=getBook