const userModel = require('../models/userModel')

const userModel = require("../model/userModel");
const jwt = require('jsonwebtoken');

 const createUser = async(req,res) => {
 try {

    let data= req.body

    let {title,name,phone,email,password} = data

        if (Object.keys(data).length == 0) {
        return res.send({status:false,msg:"for registration user data is required"})
       }

    if(!title){
        res.send({status:false,msg:"title is required for registration"})
    }

    if (!["Mr", "Mrs", "Miss"].includes(title)) {
        return res.send({ status: false, msg: "Title must be ['Mr','Mrs','Miss']" })
    }

    if (!name) {
        return res.send({ status: false, msg: "Enter your  Name" });
    }

    

   if(!(/^[\s]*[a-zA-Z]+[\s]*$/).test(name)){
    return res.status(400).send({status:false,msg:"please enter a valid Name"})
   }

    
   if(!(/^[\s]*[6-9]\d{9}[\s]*$/).test(phone)){
    return res.status(400).send({status:false,msg:"please Enter valid phone Number"})
   }

    if(!phone){
       return res.send({status:false,msg:"Enter your phone Number"})
    }

    if(!email){
        return res.send({status:false,msg:"Enter your emailId"})
    }

    

     if(!(/^[a-z0-9_]{3,}@[a-z]{3,10}.[a-z]{3,6}$/).test(email)){
        return res.send({status:false,msg:"Enter valid Email"})
     }

     let existEmail = await userModel.findone({email:data.email})
    if(existEmail){

       return res.send({status:false,msg:"EmailId is already exist"}) 
    }

     

    if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/).test(password)){          

        return res.status(400).send({status:false,msg:"please Enter valid Password"})
       }
     
    if(!password){
        return res.send({status:false,msg:"Enter your Password"})
    }


    let getUserData = await userModel.create(data);
    return res.status(201).send({ status: true, data: getUserData });


} catch (err) {
    res.status(500).send({ status: false, msg: err.message });
}
}

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
module.exports.createUser=createUser






    
 


