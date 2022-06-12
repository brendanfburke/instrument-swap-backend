const express = require('express')
const router = express.Router()
const { Account } = require('../models')
const passport = require('passport')

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        res.json(await req.user)
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res, next) => {
    
    let id = req.params.id

    try {
        res.json(await Account.find({}))
    } catch (err) {
        console.log(err)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const createdAccount = await Account.create(req.body)
        console.log(createdAccount)
    } catch (err) {
        console.log(err)
    }
})

module.exports = router