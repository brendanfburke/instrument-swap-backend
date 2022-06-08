require('dotenv').config()

const { PORT, MONGODB_URI } = process.env

const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const morgan = require("morgan");
const upload = require('./common')
const controllers = require('./controllers')

const session = require('express-session')
const MongoStore = require('connect-mongo')

const db = require("./models")

const { uploadFile, getFileStream } = require('./s3')

const fs = require('fs')
const util  = require('util')
const unlinkFile = util.promisify(fs.unlink)


const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


app.use(express.urlencoded({ extended: false }))

app.use(
    session({
        store: MongoStore.create({mongoUrl: MONGODB_URI}),
        secret: 'Secret Value',
        resave: false,
        saveUnintialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
        },
    })
)

app.use(function (req, res, next) {
    res.locals.user = req.session.currentUser;
    next();
});

app.use("/", controllers.auth)
app.use('/account', controllers.account)

require('./config/db.connection')

app.get('/users', async (req, res, next) => {
    try {
        res.json(await db.User.find({}))
    } catch (err) {
        console.log(err)
        return res.json({
            status: 'error',
            message: err
        })
    }
})

app.get('/listings', async (req, res, next) => {
    try {
        res.json(await db.Listing.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})


app.post('/listings', async (req, res, next) => {
    try {
        res.json(await db.Listing.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})
app.get('/listings/:id', async (req, res, next) => {

    let id = req.params.id

    try {
        res.json(await db.Listing.findById(id))
    } catch {
        res.status(400).json(error)
    }
})

app.post("/single", upload.single("image"), async (req, res) => {
    console.log(req.file.filename);
    // uploading to AWS S3
    const result = await uploadFile(req.file);  // Calling above function in s3.js
    console.log("S3 response", result);
    // You may apply filter, resize image before sending to client
    // Deleting from local if uploaded in S3 bucket
    await unlinkFile(req.file.path);
    res.send({
      status: "success",
      message: "File uploaded successfully",
      data: req.file,
    });
  });
  
  app.get("/images/:key", (req, res) => {
    const key = req.params.key;
    console.log(req.params.key);
    const readStream = getFileStream(key);
    readStream.pipe(res);  // this line will make image readable
  });




app.get('/', (req, res) => {
    res.json({
        status: 'Active',
        message: 'Site available for API access'
    })
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})