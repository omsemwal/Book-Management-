const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const mongoose =require('mongoose');

async function CreateBook(req, res) {
    try {

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body;

        if (Object.keys(req.body).length == 0) {
            return res.send({ status: false, msg: "for registration user data is required" })
        }
        
      if(!title){
        return res.status(400).send({status:false,msg:"title must be present"})
      }

      if(!excerpt){
        return res.status(400).send({status:false,msg:"excerpt must be present"})
      }


      if(!userId){
        return res.status(400).send({status:false,msg:"userId must be present"})
      }

      if(!ISBN){
        return res.status(400).send({status:false,msg:"ISBN must be present"})
      }

      if(!category){
        return res.status(400).send({status:false,msg:"category must be present"})
      }

      if(!subcategory){
        return res.status(400).send({status:false,msg:"subcategory must be present"})
      }

      if(!releasedAt){
        return res.status(400).send({status:false,msg:"releasedAt must be present"})
      }

    //--------------------------------------------------------------------------------------------------//  

      let existtitle = await bookModel.findOne({ title:title })
        if (existtitle) { 
            return res.send({ status: false, msg: "This title is already exist" })
    }


            let existISBN = await bookModel.findOne({ ISBN: ISBN })
            if (existISBN) {
                 return res.send({ status: false, msg: "ISBN is already exist" })
        }


   
        let getBookData = await bookModel.create(data);
        return res.status(201).send({ status: true, data: getBookData });


    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}