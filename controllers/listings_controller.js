const express = require('express')
const router = express.Router()
const { Listing } = require('../models')

router.get('/', async (req, res, next) => {
    try {
        res.json(await Listing.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


router.post('/', async (req, res, next) => {
    try {
        res.json(await Listing.create(req.body))
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