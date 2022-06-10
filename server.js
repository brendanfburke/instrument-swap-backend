require('dotenv').config()

const { PORT, MONGODB_URI } = process.env

const express = require('express')
const cors = require("cors");
const morgan = require("morgan");
const upload = require('./common')
const passport = require('passport')
const passportLocal = require('passport-local')
const cookieParser = require('cookie-parser')
const controllers = require('./controllers')

const session = require('express-session')
const MongoStore = require('connect-mongo')

const db = require("./models")

const { uploadFile, getFileStream } = require('./s3')

const fs = require('fs')
const util  = require('util')
const unlinkFile = util.promisify(fs.unlink)


const app = express()

app.use(cors({
    origin: '*'
}))
app.use(morgan('dev'))
app.use(express.json())


app.use(express.urlencoded({ extended: false }))

app.use(
    session({
        store: MongoStore.create({mongoUrl: MONGODB_URI}),
        secret: 'Secret_Value',
        resave: false,
        saveUnintialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60, // two weeks
        },
    })
)

app.use(function (req, res, next) {
    res.locals.user = req.session.currentUser;
    next();
});

app.use(cookieParser('Secret_Value'))
app.use(passport.initialize())
app.use(passport.session())

app.use("/", controllers.auth)
app.use('/account', controllers.account)
app.use('/listings', controllers.listings)

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