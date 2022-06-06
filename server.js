require('dotenv').config()

const { PORT, MONGODB_URI } = process.env

const express = require('express')
const mongoose = require('mongoose')

const app = express()


require('./config/db.connection')


app.get('/', (req, res) => {
    res.send('hello World')
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})