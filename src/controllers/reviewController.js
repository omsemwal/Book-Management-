const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')




const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


const reviewBoook = async function (req, res) {
    try{
    let paramId = req.params.bookId

    if (!mongoose.Types.ObjectId.isValid(paramId))
        return res.status(400).send({ status: false, msg: "Please enter valid path Id" });

    let findBook = await bookModel.findById(paramId).select({ __v: 0 })
    // console.log(findBook)

    if (!findBook || findBook.isDeleted)
        return res.status(404).send({ status: false, msg: "Book does not exist" })

    // res.status(200).send({status:true, data:findBook})
    const requestBody = req.body

    if (Object.keys(requestBody).length == 0)
        return res.status(400).send({ status: false, msg: "Please fill Details" })

    const { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = requestBody

    if (!isValid(bookId))
        return res.status(400).send({ status: false, msg: "Please enter book Id" })
    // check for valid Id
    if (!mongoose.Types.ObjectId.isValid(bookId))
        return res.status(400).send({ status: false, msg: "Please enter valid book Id" })
    // check with path id
    if (bookId !== paramId)
        return res.status(400).send({ status: false, msg: "Plese enter book Id same as Path Id" })

    // if ((reviewedBy))
    //     return res.status(400).send({ status: false, msg: "Plese enter reviewer name" })

        if(!(reviewedBy)){
            reviewedBy="Guest";
        }

    // if (!isValid(reviewedAt))
    //     return res.status(400).send({ status: false, msg: "Plese enter review time" })

    if (!isValid(rating))
        return res.status(400).send({ status: false, msg: "Plese enter Rating" })

    if (!(/^[0-5]$/.test(rating)))
        return res.status(400).send({ status: false, msg: "Plese enter rating from 1 to 5 in int form only" })

    let reviewCreated = await reviewModel.create(requestBody)

    await bookModel.findOneAndUpdate({_id:findBook},{$inc:{reviews:1}},{new:true})
    findBook.reviews = findBook.reviews + 1
    let abc = await findBook.save()
console.log(abc)
    let printReview = await reviewModel.findOne({ _id: reviewCreated }).select({ __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 })

    findBook = findBook.toObject()

    findBook.reviewsData = printReview
    res.status(200).send({ status: true, message: "success", data: findBook })
    }catch(err){res.status(500).send({status:false,msg:err.message})}
}



const UpdateReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        const { review, rating, reviewedBy } = req.body

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, msg: "Please Enter Reviewed data For Updating" })

        if (!reviewId) {
            return res.status(400).send({ status: false, msg: "reviewId must be present" })
        }
        if (!bookId) {
            return res.status(400).send({ status: false, msg: "bookId must be present" })
        }

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: `this  Book Id is not a valid Id` })
        }

        let findbookId = await bookModel.findById(bookId)

        if (findbookId.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "Book is already deleted" })
        }

        let updatereview = await reviewModel.findOneAndUpdate({ _id: reviewId }, {
            $set: {
                review: review,
                rating: rating,
                reviewedBy: reviewedBy,
            },
        }, { new: true })

        return res.status(200).send({ status: true, message: "updated review", data: updatereview })

    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const DeleteReview = async function(req,res){
    try{
    let bookId=req.params.bookId
    let reviewId=req.params.reviewId

    let book = await bookModel.findById(bookId)
    if(!book){
        return res.satus(400).send({status:false,message:"book is not present"})
    }

    let review=await reviewModel.findById(reviewId)
    
    if(!review||review.isDeleted==true){
    return res.status(400).send({status:false,message:"revew is not present/or deleted"})
    }else{
        let data=await reviewModel.findByIdAndUpdate({_id:reviewId},{$set:{isDeleted:true}})
        book.reviews=book.reviews-1
       let save= await book.save()

return res.status(200).send({status:true,message:"deletion of review is completed"})
    }
}catch(err){
    res.status(500).send({ status: false, msg: err.message })
}

}

module.exports={reviewBoook,UpdateReview,DeleteReview}
