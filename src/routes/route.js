const express = require('express');
const router = express.Router();
const user=require('../controllers/userController')
//.................test................................. */
router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//.............Api............................

router.post("/createUser",user.createUser)
router.post("/login",user.login)


module.exports = router;