const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')
const mongoose = require('mongoose')




let isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


const reviewBoook = async function (req, res) {
    try{
    let paramId = req.params.bookId

    if (!mongoose.Types.ObjectId.isValid(paramId))
        return res.status(400).send({ status: false, msg: "Please enter valid path Id" });

    let findBook = await bookModel.findById(paramId).select({ __v: 0 ,deletedAt:0,})

    if (!findBook || findBook.isDeleted==true)
        return res.status(404).send({ status: false, msg: "Book does not exist" })

    if (Object.keys(req.body).length == 0)
        return res.status(400).send({ status: false, msg: "Please fill Details" })

    let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = req.body

    if (!bookId)
        return res.status(400).send({ status: false, msg: "Please enter book Id" })
    // check for valid Id
    if (!mongoose.Types.ObjectId.isValid(bookId))
        return res.status(400).send({ status: false, msg: "Please enter valid book Id" })
    // check with path id
    if (bookId !== paramId)
        return res.status(400).send({ status: false, msg: "Plese enter book Id same as Path Id" })

    if ((reviewedBy)){
        if(!(/^[a-zA-Z]*[\s]*[a-zA-Z]*\s?$/).test(reviewedBy)){
        return res.status(400).send({ status: false, msg: "Plese enter valid reviewer name" })
        }
    }
        // if(!(reviewedBy)){
        //     reviewedBy="Guest";
        // }

    // if (!isValid(reviewedAt))
    //     return res.status(400).send({ status: false, msg: "Plese enter review time" })
    if(typeof review !== "string")return res.status(400).send({ status: false, msg: "Plese enter valid reviewer name" })

    if (!isValid(rating))
        return res.status(400).send({ status: false, msg: "Plese enter Rating" })

    if (!(/^[0-5]$/.test(rating)))
        return res.status(400).send({ status: false, msg: "Plese enter rating from 1 to 5 in integer form only" })

    let reviewCreated = await reviewModel.create(req.body)

    await bookModel.findOneAndUpdate({_id:findBook},{$inc:{reviews:1}},{new:true})
    findBook.reviews = findBook.reviews + 1
     await findBook.save()
    let printReview = await reviewModel.findOne({ _id: reviewCreated }).select({ __v: 0, createdAt: 0, updatedAt: 0, isDeleted: 0 })
    findBook = findBook.toObject()

    findBook.reviewsData = printReview
    res.status(200).send({ status: true, message: "success", data: findBook })
    }catch(err){res.status(500).send({status:false,msg:err.message})}
}



const UpdateReview = async (req, res) => {
    try {
        let bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: `this  Book Id is not a valid Id` })
        }
        let reviewId = req.params.reviewId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).send({ status: false, msg: `this  review id is not a valid Id` })
        }
        const { review, rating, reviewedBy } = req.body

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, msg: "Please Enter some data to upadte a review" })

            if(review){
                if(typeof review !== "string"){return res.status(400).send({status:false,msg:"you can give only string"})}
            }

            if ((rating)){
            if (!(/^[0-5]$/.test(rating)))
        return res.status(400).send({ status: false, msg: "Plese enter rating from 1 to 5 in integer form only" })
            }
            
        if ((reviewedBy)){
            if(!(/^[a-zA-Z]*[\s]*[a-zA-Z]*\s?$/).test(reviewedBy)){
            return res.status(400).send({ status: false, msg: "Plese enter valid reviewer name" })
            }
        }

        // if (!reviewId) {
        //     return res.status(400).send({ status: false, msg: "reviewId must be present" })
        // }
        // if (!bookId) {
        //     return res.status(400).send({ status: false, msg: "bookId must be present" })
        // }

       

        let findbookId = await bookModel.findById(bookId)

        if (!findbookId||findbookId.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "Book is already deleted" })
        }

        let updatereview = await reviewModel.findOneAndUpdate({ _id: reviewId }, {
            $set: {
                review: review,
                rating: rating,
                reviewedBy: reviewedBy,
            },
        }, { new: true })

        return res.status(200).send({ status: true, message: " review updated", data: updatereview })

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
    
if(!review) return res.status(400).send("No review found with this reviewID")

if(review.isDeleted==true) return res.status(400).send("This review has already been deleted.")
 
        let data=await reviewModel.findByIdAndUpdate({_id:reviewId},{$set:{isDeleted:true}})
        book.reviews=book.reviews-1
       let save= await book.save()

return res.status(200).send({status:true,message:"This review has been deleted successfully."})

}catch(err){
    res.status(500).send({ status: false, msg: err.message })
}

}

module.exports={reviewBoook,UpdateReview,DeleteReview}
