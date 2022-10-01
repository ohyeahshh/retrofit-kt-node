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


    router.post('/regPhone', async (req, res) => {
      
        const user = await User.findOne({
            phone: req.body.phone,
        })

        if (!user) {
            res.status(200).send({response: "Phone not registered"})
        }else{
            res.status(400).send({error: "Phone already registered"})
        }
    })



    router.get('/regEmail', async (req, res) => {
      
        const user = await User.findOne({
            email: req.body.email,
        })
        if (!user) {
            res.status(200).send({response: "Email not registered"})
        }else{
            res.status(400).send({error: "Email already registered"})
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
        res.status(401).send({error: "Login failed! Check credentials"})
        }
        else{
            res.status(200).send({user})
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
        res.status(200).send({user})
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
                res.status(200).send({user})
                }
            }
    catch(error){
        res.status(400).send({error})
    }
})

const User = require("../models/User");

module.exports = router
