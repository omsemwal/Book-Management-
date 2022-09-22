const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');

 const createUser = async(req,res) => {
 try{
    let {title,name,phone,email,password} = req.body

        if (Object.keys(req.body).length == 0){
            return res.status(400).send({status:false,msg:"for registration user data is required"})
        }

        if(!title){
            return res.status(400).send({status:false,msg:"title is required for registration"})
        }

    if (!["Mr", "Mrs", "Miss"].includes(title)) {
        return res.status(400).send({ status: false, msg: "Title must be ['Mr','Mrs','Miss']" })
    }

    if (!name) {
        return res.status(400).send({ status: false, msg: "Enter your  Name" });
    }

   if(!(/^[\s]*[a-zA-Z]+[\s]*$/).test(name)){//
    return res.status(400).send({status:false,msg:"Please enter a valid Name"})
   }

    
   if(!(/^[\s]*[6-9]\d{9}[\s]*$/).test(phone)){
    return res.status(400).send({status:false,msg:"Please Enter valid phone Number"})
   }

    if(!phone){
       return res.status(400).send({status:false,msg:"Enter your phone Number"})
    }

    if(!password){
        return res.status(400).send({status:false,msg:"Enter your Password"})
    }

    let existphone = await userModel.findOne({phone:phone})
    if(existphone){return res.status(400).send({status:false,msg:"Phone is already exist"})} 

    if(!email){
        return res.status(400).send({status:false,msg:"Enter your emailId"})
    }

    

     if(!(/^[a-z0-9_]{3,}@[a-z]{3,10}[.]{1}[a-z]{3,6}$/).test(email)){
        return res.status(400).send({status:false,msg:"Enter valid Email"})
     }

    

     let existEmail = await userModel.findOne({email:email})
    if(existEmail){

       return res.status(400).send({status:false,msg:"EmailId is already exist"}) 
    }

   
    if(!password){
        return res.status(400).send({status:false,msg:"Enter your Password"})
    }

    if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/).test(password)){          

        return res.status(400).send({status:false,msg:"please Enter valid Password"})
       }
    
    let savedData = await userModel.create(req.body);
    return res.status(201).send({ status: true,message: 'Success', data: savedData });


} catch (err) {
    res.status(500).send({ status: false, msg: err.message });
}
}


const login = async (req, res)=> {
    try {

        let requestQuery = req.query
        let requestBody = req.body

        if (Object.keys(requestQuery).length > 0) {
            res.status(400).send({ status: false, msg: "invalid entry " })
        }

        if (Object.keys(requestBody).length == 0) {
            res.status(400).send({ status: false, msg: "data is required in request body" })
        }

        if (Object.keys(requestBody).length > 2) {
            res.status(400).send({ status: false, msg: "invalid request" })
        }

        const { email, password } = req.body
        if (!email) {
            return res.status(400).send({ status: false, msg: "Email is required" })
        }

        if (!password) {
            return res.status(400).send({ status: false, msg: "Password is required" })
        }
        let data = await userModel.findOne({ email: email, password: password })

        if (!data) {
            return res.status(400).send({ msg: "email and password is incorrect" })
        }

        let token = await jwt.sign({ id: data._id.toString() }, "functionupiswaywaycoolproject3group9", { expiresIn: '24h' })
        res.header({ "x-api-key": token })
        res.status(200).send({ status: true, msg: "Login Successful", data: token })
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }


}
module.exports.login = login
module.exports.createUser=createUser






    
 


