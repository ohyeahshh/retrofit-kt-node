const express = require('express')
const router = express.Router()
const app = express()
const nodemailer = require("nodemailer");

  const sendingMail = async(subject, receiver, text) =>{

    async function main() {
    
      
        let transporter = nodemailer.createTransport({
         service: 'gmail',
        
          auth: {
            user: 'darthvader14112@gmail.com', // generated ethereal user
            pass: "ijmuaagqievbdiwp", // generated ethereal password
          },
        });

    let info = await transporter.sendMail({
        from: '"Infuxion 🏦" <darthvader14112@gmail.com>', // sender address
        to: receiver, 
        subject: subject, 
        html: "<b>"+text+"</b>", 
    });

  console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);

 

}

sendingMail("Testing", "moondst14@gmail.com", "Here's a test email")

//Get all users
router.get('/users', async (req, res) => {
            const user = await User.find().select({ __v:0, tokens: 0})
            if (!user) {
                res.status(400).send({error: "No users"})
            }else{
                
                res.status(200).send(user)
            }
        })

router.post('/hello', async (req, res) => {
            console.log("Phone")
         phone = req.body.phone;
            console.log(phone)
              res.status(200).send({ message: "Phone not registered. Available for registeration", phone: phone, statusId: 200})
        })



        router.get('/regPhone', async (req, res) => {  
  
            const phoneNum = req.query.phone;
            try{
       
                 const user = await User.findOne({
                     phone: phoneNum,
                 })
                 if (!user) {
                     res.status(200).send({ message: "Phone not registered. Available for registeration", statusId: 200})
                 }else{
                     res.status(200).send({ message: "Phone is already registered", statusId: 401 })
                 }
            }
            catch(error){
                          res.status(404).send({ message: error})
            }
 })


//Check Phone
            router.post('/checkPhone', async (req, res) => {  
            console.log(req.body.phone);
            const phone = req.body.phone;
            try{

                 const user = await User.findOne({
                     phone: phone,
                 })
                 if (!user) {
                     res.status(200).send({ message: "Phone not registered. Available for registeration", phone: phone, statusId: 200})
                 }else{
                     res.status(200).send({ message: "Phone is already registered",  phone: phone, statusId: 401 })
                 }
            }
            catch(error){
                          res.status(404).send({statusId: 404, message: error, phone:phone})
            }
 })

//Check Email
 router.post('/checkEmail', async (req, res) => {  
    console.log(req.body.email);
    const email = req.body.email;
    try{

         const user = await User.findOne({
            email: email,
         })
         if (!user) {
             res.status(200).send({ message: "Email not registered. Available for registeration", email: email, statusId: 200})
         }else{
             res.status(200).send({ message: "Email is already registered",  email: email, statusId: 401 })
         }
    }
    catch(error){
                  res.status(404).send({statusId: 404, message: error, email:email})
    }
})


router.post('/createUser', async (req, res) => {
    console.log(req.body)
    let dateTime = new Date();     
    try{
    
        const user = new User({
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            phone:req.body.phone,
            email: req.body.email,
            fatherName:req.body.fatherName,
            dob: req.body.dob,    
            createdOn:dateTime,
            imei:"null",
            location:"null",
            kyc:false
         })
        await user.save()
        res.status(201).send({statusId:201, message: "User Created"})
    }
    catch(error){
        res.status(400).send({statusId:400, message: "Something went wrong. Please try again."})
    
    }
})




router.post('/userLogin', async (req, res) => {
            const user = await User.findOne({
                phone:req.body.phone,
                email: req.body.email,
            })
            if(!user){
                res.status(401).send({ message: "Login failed"})
            }
            else{
                res.status(200).send({ message: "Login successful!"})     
            }
})




router.post('/loginPhone', async (req, res) => {
    try{
        const user = await User.findOne({
             phone: req.body.phone})
        if(!user){
        res.status(401).send({error: "Login failed! Phone not registered."})
        }
        else{
         res.status(200).send({ message: "Great! Phone is registered.!"})
        }
    }
    catch(error){
        res.status(400).send({error})
    }
})


router.post('/loginEmail', async (req, res) => {
    try{
        const user = await User.findOne({
            email: req.body.email})
            if(!user){
                res.status(401).send({error: "Login failed! Email not registered."})                }
                else{
                        res.status(200).send({ message: "Great! Email is registered.!"})
                }
            }
    catch(error){
        res.status(400).send({error})
    }
})

const User = require("../models/User");

module.exports = router
