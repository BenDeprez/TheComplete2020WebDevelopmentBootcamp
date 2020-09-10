// imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

// init app
const app = express();

app.set('view engine', 'ejs');

// body parser & static folder
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// session config
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())

// connect DB
mongoose.connect(process.env.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});


// schemas
// user
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose)

// secret
const secretSchema = new mongoose.Schema({
  secret: String,
});

// models
// user
const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// secret
const Secret = new mongoose.model('Secret', secretSchema);

// HOME
app.get('/', (req, res) => {
  res.render('home');
});

// LOGIN
app
  .route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
  });

// REGISTER
app
  .route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {
  });

// SUBMIT
app.post('/submit', (req, res) => {
  const newSecret = new Secret({
    secret: req.body.secret,
  });
  Secret.insertOne({ secret: newSecret }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('successfully added secret');
    }
  });
});

// port config
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
