const jwt = require("jsonwebtoken");

const authentication = function (req,res,next){
    try {   
         let token =req.headers["x-api-key"]
         if(!token){
            return res.status(404).send({status:false,msg:"token must be present"})
         }
        jwt.verify(token,"functionupiswaywaycoolproject3group9",function(error,decoded){
            if(error)return res.status(400).send("this token is invslid")
            else{
               decoded
               next()
            }
         })
        
    } catch (error) {
        return res.status(500).send({status:false,msg:error.mssage})}
      
}

module.exports.authentication=authentication

//===================================================authorisation====================================//

