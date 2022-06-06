require('dotenv').config()

const { PORT, MONGODB_URI } = process.env

const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const morgan = require("morgan");


const User = require('./models/User');

const app = express()

require('./config/db.connection')

app.post('/users', async (req, res, next) => {
    try {
        res.json(await User.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})





app.get('/', (req, res) => {
    res.send('hello World')
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})