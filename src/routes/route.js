const express = require('express');
const router = express.Router();
const user=require('../controllers/userController')
const book=require('../controllers/bookController')
//.................test................................. */
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//.............Api............................

router.post("/createUser",user.createUser)
router.post("/login",user.login)


router.post("/createBook",book.createBook)

router.get("/books",book.getBook)

router.get("/books/:bookId",book.getbooksbyid)

module.exports = router;