const userModel = require('../models/userModel')

const login = async function (req, res) {
    try {

        let requestQuery = req.query
        let requestBody = req.body

        if (Object.keys(requestQuery).length > 0) {
            res.status(400)
                .send({ status: false, msg: "invalid entry " })
        }


        if (Object.keys(requestBody).length == 0) {
            res.status(400)
                .send({ status: false, msg: "data is required in request body" })
        }

        if (Object.keys(requestBody).length > 2) {
            res.status(400)
                .send({ status: false, msg: "invalid request" })
        }

        const { email, password } = req.body
        if (!email) {
            return res
                .status(400)
                .send({ status: false, msg: "Email is required" })
        }


        if (!password) {
            return res
                .status(400)
                .send({ status: false, msg: "Password is required" })
        }

        console.log(email, password)
        let data = await userModel.findOne({ email: email, password: password })

        if (!data) {
            return res
                .status(400)
                .send({ msg: "email and password is incorrect" })
        }

        let token = await jwt.sign({ id: data._id.toString() }, "functionupiswaywaycoolproject3group9", { expiresIn: '24h' })

        res.header({ "x-api-key": token })
        res.status(200).send({ status: true, msg: "Login Successfull", data: token })
    }

    catch (err) {
        console.log(err.message);
        res.status(500).send({ error: err.message });
    }


}
module.exports.login = login