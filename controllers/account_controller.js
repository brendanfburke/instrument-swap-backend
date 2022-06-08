const express = require('express')
const router = express.Router()
const { Account } = require('../models')

router.get('/', async (req, res, next) => {
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