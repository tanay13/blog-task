require('dotenv').config();

const express = require('express');
const passport = require('passport');
var bodyParser = require('body-parser');
var blogRoutes = require('./routes/blogs');
const methodOverride = require('method-override');
var authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const { verifyLogin, currentUser } = require('./middleware/middleware');
const mongoose = require('mongoose');

var PORT = process.env.PORT || 5000;

const app = express();

require('./config/passport-setup');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI, () => {
  console.log('database connected');
});

app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());

app.use(currentUser);

app.get('/', (req, res) => {
  res.render('index');
});
app.use('/blogs', blogRoutes);
app.use('/auth', authRoutes);

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log('Server is running');
});
