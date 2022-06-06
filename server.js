require('dotenv').config()

const { PORT, MONGODB_URI } = process.env

const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(MONGODB_URI)

mongoose.connection.on('open', () => {
    console.log('MongoDB connected')
})
mongoose.connection.on('close', () => {
    console.log('MongoDB disconnected')
})    
mongoose.connection.on('error', (error) => {
    console.log('error', error)
})   


app.get('/', (req, res) => {
    res.send('hello World')
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})