const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET

const { Strategy, ExtractJwt } = require("passport-jwt");

const opts = {

  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

  secretOrKey: secret,
};

const User = require("./models/User");


const strategy = new Strategy(opts, function (jwt_payload, done) {
  User.findById(jwt_payload.id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});


passport.use(strategy);

passport.initialize();

const requireToken = passport.authenticate("jwt", { session: false });

const createUserToken = (req, user) => {
  if (
    !user ||
    !req.body.password ||
    !bcrypt.compareSync(req.body.password, user.password)
  ) {
    const err = new Error("The provided username or password is incorrect");
    err.statusCode = 422;
    throw err;
  }
  return jwt.sign({ id: user._id }, secret, { expiresIn: 36000 });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers[authorization]
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    next()
  })

}

module.exports = {
  requireToken,
  createUserToken,
  authenticateToken
};