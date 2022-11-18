const express = require('express')
const router = express.Router()
const app = express()
const nodemailer = require("nodemailer");

const SibApiV3Sdk = require('sib-api-v3-sdk');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDBLUE_API_KEY

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();






  const sendingMail = async(subject, receiver, text) =>{

    async function main() {
    
      
        let transporter = nodemailer.createTransport({
         host: ' smtp-relay.sendinblue.com ',
         port: 587,
         secure: false,
        
          auth: {
            user: 'divyayashsaxena2000@gmail.com', // generated ethereal user
            pass: "UItmH5RhSsBDVw3Q", // generated ethereal password
          },
        });

    let info = await transporter.sendMail({
        from: '"Infuxion 🏦" <divyayashsaxena2000@gmail.com>', // sender address
        to: receiver, 
        subject: subject, 
        html: "<p>"+text+"</p>", 
    });

  console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);

 

}

  
//Save IMEI
router.post('/saveImei', async (req, res) => {
    console.log(req.body)
    ImeiRecord.countDocuments().then(async(count_documents) =>{
        try{
            const count = (count_documents).toLocaleString('en-US', {minimumIntegerDigits: 9, useGrouping:false})
            const imeiRecord = new ImeiRecord({
                tempId: `INF-TEMP-${count}`,
                imei: req.body.imei,    
                createdOn:new Date()
             })
             console.log(imeiRecord)
            await imeiRecord.save()
            res.status(201).send({message: "Record added"})
        }
        catch(err){
            res.status(404).send({message: error})
        }
	}).catch((err) => {
        res.status(404).send({message: err})
	  console.log(err.Message);
	})

})

//Save Permissions
router.post('/savePermissions', async (req, res) => {
    console.log(req.body)
    Permissions.countDocuments().then(async(count_documents) =>{
        try{
            const count = (count_documents).toLocaleString('en-US', {minimumIntegerDigits: 9, useGrouping:false})
            const permissions = new Permissions({
                isLocationGranted : req.body.isLocationGranted,
                isReadSmsGranted : req.body.isReadSmsGranted,
                isContactsGranted : req.body.isContactsGranted, 
                createdOn:new Date()
             })
             console.log(permissions)
            await permissions.save()
            res.status(201).send({message: "Record added"})
        }
        catch(err){
            res.status(404).send({message: error})
        }
	}).catch((err) => {
        res.status(404).send({message: err})
	  console.log(err.Message);
	})


})

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
            
            const otp =(Math.floor(100000 + Math.random() * 900000)+1);
            sendSmtpEmail.subject = "{{params.subject}}";
            sendSmtpEmail.htmlContent = "<html><body ><p style='background:#8D32A7; font-size:14px; padding:20px;color:#fff'>Your registeration OTP is: {{params.parameter}}</p></body></html>";
            sendSmtpEmail.sender = {"name":"Infuxion 🏦","email":"divyayashsaxena2000@gmail.com"};
            sendSmtpEmail.to = [{"email":email, "name":"Moon Dust"}];
            sendSmtpEmail.params = {"parameter":otp,"subject":"OTP for authenticating email"};
            
            apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
              console.log('Returned data: ' + JSON.stringify(data));
            }, function(error) {
              console.error(error);
            });

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
    const phone = req.body.phone
    const name = req.body.firstName
    const fatherName = req.body.fatherName
    const dob = req.body.dob
    const fullName = req.body.firstName+' '+req.body.middleName+' '+req.body.lastName
            console.log(custId)   
    try{
    
        const user = new User({
            customerId: custId,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            phone:phone,
            email: email,
            fatherName:fatherName,
            dob: dob,    
            createdOn:dateTime,
            imei:"Null",
            location: req.body.location,
            kyc:false
         })
        await user.save()
        sendSmtpEmail.subject = "Congrats, {{params.name}}! You are successfully registered on Infuxion!";
        sendSmtpEmail.htmlContent = "<html><body ><p style='background:#8D32A7; font-size:14px; padding:20px;color:#fff'>Your registeration information is:</p> <br> <p>Customer Id:{{params.custId}} </p><p>Name:{{params.name}} </p><p>Email:{{params.email}} </p> <p>Phone:{{params.phone}} </p> <p>Father's Name:{{params.fatherName}} </p><p>DOB:{{params.dob}} </p></body></html>";
        sendSmtpEmail.sender = {"name":"Infuxion 🏦","email":"divyayashsaxena2000@gmail.com"};
        sendSmtpEmail.to = [{"email":email, "name":"Moon Dust"}];
        sendSmtpEmail.params = {"name":name, "fullName": fullName, "custId":custId, "dob": dob, "fatherName": fatherName, "phone":phone, "email": email,  "subject":"OTP for authenticating email"};
        
        apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
          console.log('Returned data: ' + JSON.stringify(data));
        }, function(error) {
          console.error(error);
        });
        
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
const ImeiRecord = require("../models/ImeiRecord");
const Permissions = require("../models/Permissions");

module.exports = router
