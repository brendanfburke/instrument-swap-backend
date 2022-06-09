const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { User } = require('../models')


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
            newUser: req.body.username
        })
    } catch (err) {
        console.log(err)
        return res.json({
            status: 'error',
            message: err
        })
    }
} )

router.post('/login', async (req, res, next) => {
    // try {
    //     const foundUser = await User.findOne({ username: req.body.username })
    //     console.log(foundUser)

    //     if (!foundUser) {
    //         res.json({
    //             status: 'no user found',
    //             message: 'redirect to register page'
    //         })
    //     }

    //     const match = await bcrypt.compare(req.body.password, foundUser.password)

    //     if (!match) {
    //         res.json({
    //             status: 'password invalid',
    //             message: 'enter a valid username or password'
    //         })
    //     }

    //     req.session.currentUser = {
    //         id: foundUser._id,
    //         username: foundUser.username
    //     }

    //     res.json({
    //         status: 'Logged in'
    //     })

    // } catch (err) {
    //     console.log(err)
    //     return res.json({
    //         status: 'error',
    //         message: err
    //     })
    // }
    
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("No User Exists");
        else {
          req.logIn(user, (err) => {
            if (err) throw err;
            res.send("Successfully Authenticated");
            console.log(req.user);
          });
        }
      })(req, res, next);


})


router.get("/logout", async (req, res) => {
    try {
        await req.session.destroy();
        console.log(req.session);
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});


module.exports = router