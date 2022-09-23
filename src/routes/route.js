const express = require('express');
const router = express.Router();
const user=require('../controllers/userController')
const book=require('../controllers/bookController')
const review =require('../controllers/reviewController')
const auth = require("../Middleware/auth")
//.................test................................. */

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//.............Api............................

router.post("/register",user.createUser)
router.post("/login",user.login)

//..................BookApi......................
router.post("/books",book.createBook)

router.get("/books",auth.authentication,book.getBookByquery)

router.get("/books/:bookId",book.getbooksbyid)

router.put("/books/:bookId",auth.authentication,book.updateBook)

router.delete("/books/:bookId",book.DeletedBook)
//..................ReviewApi..........................
router.post("/books/:bookId/review",review.reviewBoook)

router.put("/books/:bookId/review/:reviewId",review.UpdateReview)
module.exports = router;


