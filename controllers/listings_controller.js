const express = require('express')
const router = express.Router()
const { Listing } = require('../models')
const passport = require('passport')

router.get('/', async (req, res, next) => {
    try {
        res.json(await Listing.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


router.post('/new', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        res.json(await Listing.create(req.body))
        res.json(await req.user)
    } catch (error) {
        res.status(400).json(error)
    }
})
router.get('/:id', async (req, res, next) => {

    let id = req.params.id

    try {
        res.json(await Listing.findById(id))
    } catch {
        res.status(400).json(error)
    }
})

module.exports = router