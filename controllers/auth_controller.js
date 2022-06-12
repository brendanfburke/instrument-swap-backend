const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const passport = require('passport')
const { createUserToken } = require("../passport_config");


router.post('/register', async (req, res, next) => {
    try {
        const foundUser = await User.exists({ username: req.body.username })
        if (foundUser) {
            res.json({
                status: 'Login',
                message: 'User Exists, redirect to login'
            })
        }
    
        const salt = await bcrypt.genSalt(12)
        const hash = await bcrypt.hash(req.body.password, salt)
    
        req.body.password = hash
    
        const newUser = await User.create(req.body)
        res.json({
            newUser: newUser
        })
    } catch (err) {
        console.log(err)
        // return res.json({
        //     status: 'error',
        //     message: err
        // })
    }
} )

router.post('/login', async (req, res, next) => {
    try {
        const foundUser = await User.findOne({ username: req.body.username })

        if (!foundUser) {
            res.json({
                status: 'no user found',
                message: 'redirect to register page'
            })
        }

        const match = await bcrypt.compare(req.body.password, foundUser.password)

        if (!match) {
            res.json({
                status: 'password invalid',
                message: 'enter a valid username or password'
            })
        }

        const token = await createUserToken(req, foundUser);
        res.status(200).json({
            user: foundUser,
            isLoggedIn: true,
            token,
    });

    } catch (err) {
        console.log(err)
        // return res.json({
        //     status: 'error',
        //     message: err
        // })
    }
    

})


router.get("/logout", async (req, res) => {
    try {
        res.json({
            status: 'Logged out'
        })
    } catch (error) {
        console.log(error);
    }
});


module.exports = router