const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://azpardo:TtCgXOhgVnYeHd09@cluster0.ar6n7zk.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {console.log('connected');app.listen(3000);})
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', requireAuth,(req, res) => res.render('home'));
app.get('/smoothies', requireAuth,(req, res) => res.render('smoothies'));

app.use(authRoutes);