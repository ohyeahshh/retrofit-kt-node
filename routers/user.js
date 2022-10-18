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
        html: "<p>"+text+"</p>", 
    });

  console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);

 

}


//Get all users
router.get('/users', async (req, res) => {



            const user = await User.find().select({tokens: 0})
            if (!user) {
                res.status(400).send({error: "No users"})
            }else{
                
                res.status(200).send(user)
            }
        })



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



 router.post('/checkEmail', async (req, res) => {  
    console.log(req.body.email);
    const email = req.body.email;
    try{

         const user = await User.findOne({
            email: email,
         })
         if (!user) {
            const otp =Math.floor((Math.random()*1000000)+1);
           await sendingMail("OTP for authenticating email", email, `Your registeration OTP is ${otp} `)


             res.status(200).send({ message: "Email not registered. Available for registeration", email: email, statusId: 200, otp:otp})
         }else{
             res.status(200).send({ message: "Email is already registered",  email: email, statusId: 401})
         }
    }
    catch(error){
                  res.status(404).send({statusId: 404, message: error, email:email})
    }
})











router.post('/createUser', async (req, res) => {
    console.log(req.body)
    let dateTime = new Date();  
    const code =Math.floor((Math.random()*10000000)+1);
            const custId =`INF${code}`;
            const text =`Your registeration details are: Customer Id: ${custId}, Full Name: ${req.body.firstName} ${req.body.middleName} ${req.body.lastName}, Phone: ${req.body.phone}, Email: ${req.body.email}`;
    const email = req.body.email
            console.log(custId)   
    try{
    
        const user = new User({
            customerId: custId,
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
        await sendingMail("Congrats! Successfully registered on Infuxion!", email, text)
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



const User = require("../models/User");

module.exports = router
