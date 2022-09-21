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
        try {
            const filter = { isDeleted: false }
    
            const queryParams = req.query
            {
                const { userId, category, subcategory } = queryParams
                if (userId) {
                    if (!mongoose.Types.ObjectId.isValid(userId)) {
                        return res.status(400).send({ status: false, msg: `this ${userId} user Id is not a valid Id` })
                    }
                    filter["userId"] = userId
                    // filter.userId = userId
                    console.log(filter)
                }
    
                if (category) {
                    filter['category'] = category
                }
    
                if (subcategory) {
                    filter['subcategory'] = subcategory
                }
            }
           
            const books = await bookModel.find(filter).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).collation({ locale: "en" }).sort({ title: 1 })
    
            if (Object.keys(books).length == 0)
                return res.status(404).send({ status: false, msg: "No book found" })
    
            res.status(200).send({ status: true, msg: "success", data: books })
    
        }
        catch (err) {
            console.log(err.message)
            res.status(500).send({ status: false, Error: err.message })
        }
    }
    // const getBook = async function (req, res) {

    //     requestQuery = req.query
    //     let { userId, category, subcategory } = requestQuery
    
    //     if (Object.keys(requestQuery).length == 0) {
    //         let book = await bookModel.find({ isDeleted: false }).select({ book_id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, })
    //         if (book) {
    //             return res.status(200).send({ status: true, data: book })
    //         } else {
    //             return res.status(404).send({ status: false, msg: "not a valid request" })
    
    //         }
    //     }
    //     let final = await bookModel.find({ $or:[{ userId: userId},{ category: category}, {subcategory: subcategory }] }, { isDeleted: false }).collation({ locale: "en" }).sort({ title: 1 })

    //     if (!final) {
    //         return res.status(404).send({ status: false, msg: "data not found" })
    //     } else {
    //         return res.status(200).send({ status: true, data: final })
    //     }
    
    
    
    
    // }
    



    const getbooksbyid = async (req,res)=>{
        try {
            let bookid1 = req.params.bookId
            if(!bookid1)return res.status(400).send({status:false,msg:"please give book id"})
            if(!mongoose.Types.ObjectId.isValid(bookid1))return res.status(400).send({status:false,msg:"please enter valid bookid"})
            
            let book = await bookModel.findById(bookid1)//{_id:bookid1,isDeleted:false}
            if (!book || book.isDeleted==true)
            return res.status(404).send({ status: false, message: "No Book Found" })
            const {title,_id,excerpt,userId,category,reviews,releasedAt}=book
            let review = await reviewmodel.find({bookId:bookid1})
            let result ={title,_id,excerpt,userId,category,reviews,releasedAt,review}

            return res.status(200).send({status:true,data:result})
        } catch (error) {
            res.status(500).send({ status: false, msg: error.message });
    }     }


module.exports = {createBook,getbooksbyid,getBook}