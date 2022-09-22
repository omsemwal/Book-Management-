const jwt = require("jsonwebtoken");

const authentication =async function (req,res,next){
    try {   
         let token =req.headers["x-api-key"]
         if(!token){
            return res.status(404).send({status:false,msg:"token must be present"})
         }
         let decodedtoken=jwt.verify(token,"functionupiswaywaycoolproject3group9")

         if(!decodedtoken){
            return res.status(401).send({status:false,msg:"invalid Token"})
         }
         if(decodedtoken){

            next()
         }
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.mssage})
        
    }
}


module.exports.authentication=authentication

//===================================================authorisation====================================//

