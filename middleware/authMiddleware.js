const jwt = require('jsonwebtoken');
const User = require('../models/User')
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPEKEY);

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };

//stripe middleware
const checkActiveUser = async (req, res, next) =>{
  const customers = await stripe.customers.list({
    email: res.locals.user.email,
  });


 try{ const customer_id = customers.data[0].id

  const subscriptions = await stripe.subscriptions.list({
    customer: customer_id,
  });

  const status = subscriptions.data[0].status
  console.log(status)
  if (status == 'active')
  {
    next();
  }
  else{
    res.redirect('/')
  }}
  catch{
    res.redirect('/')
  }
}
  
  
module.exports = { requireAuth, checkUser, checkActiveUser };