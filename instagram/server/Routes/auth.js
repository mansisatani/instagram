const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const { route } = require('express/lib/router');

/////////////////////////////////////////////////////////////////// fetching userData ///////////////////////////////////////////////////////////////////////
router.get('/protected',(req,res)=>{

})

/////////////////////////////////////////////////////////////////// signup-route /////////////////////////////////////////////////////////////////////////////
router.post('/signup',(req,res)=>{
    const{name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(422).json({error:"please input all the fields"})
    } 
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that same email"})
        }

        bcrypt.hash(password,12).then(hashedPassword=>{
            const user = new User({
                name,
                email,
                password:hashedPassword
                // name:name,
                // email:email,
                // password:password
            })
            user.save().then(user=>{
                res.json({message:"user saved successfully"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
        
    }).catch(err=>{
        console.log(err);
    })
})
////////////////////////////////////////////////////////////////// signin(login)-route //////////////////////////////////////////////////////////////////////
router.post('/signin',(req,res)=>{
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(422).json({error:"please enter your email and username"});
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:"invalid email or password"});
        }
        bcrypt.compare(password,savedUser.password).then(doMatch=>{
            if(doMatch){
                // return res.json({message:"succesfully logged in"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token})
            }else{
                return res.status(422).json({error:"invalid email or password"});
            }
        }).catch(err=>{
            console.log(err);
        })
    })
})

module.exports = router