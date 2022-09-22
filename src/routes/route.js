const express = require('express');
const router = express.Router();
const user=require('../controllers/userController')
const book=require('../controllers/bookController')
//.................test................................. */

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//.............Api............................

router.post("/register",user.createUser)
router.post("/login",user.login)


router.post("/books",book.createBook)

router.get("/books",book.getBookByquery)

router.get("/books/:bookId",book.getbooksbyid)

router.put("/books/:bookId",book.updateBook)

module.exports = router;


