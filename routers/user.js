const express = require('express')
const router = express.Router()
const app = express()


//Get all users
router.get('/users', async (req, res) => {
            const user = await User.find().select({ __v:0, tokens: 0})
            if (!user) {
                res.status(400).send({error: "No users"})
            }else{
                
                res.status(200).send(user)
            }
        })


   router.get('/regPhone', async (req, res) => {  
               try{
                    const user = await User.findOne({
                        phone: req.body.phone,
                    })
                    if (!user) {
                        res.status(200).send({ message: "Phone not registered. Available for registeration"})
                    }else{
                        res.status(401).send({ message: "Phone is already registered"})
                    }
               }
               catch(error){
                             res.status(404).send({ message: error})
               }
    })



    router.post('/regEmail', async (req, res) => {
      
        const user = await User.findOne({
            email: req.body.email,
        })
      if (!user) {
            res.status(200).send({ message: "Email not registered. Available for registeration"})
        }else{
            res.status(401).send({ message: "Email is already registered"})
        }
    })


router.post('/createUser', async (req, res) => {
    let dateTime = new Date();
   
    try{
       console.log(req.body)
        const user = new User({
            firstName: req.body.firstName,
            secondName: req.body.secondName,
            lastName: req.body.lastName,
            phone:req.body.phone,
            email: req.body.email,
            fatherName:req.body.fatherName,
            dob: req.body.dob,    
            createdOn:dateTime
         })
        await user.save()
        res.status(200).send({user})
    }
    catch(error){
        res.status(400).send({error})
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
