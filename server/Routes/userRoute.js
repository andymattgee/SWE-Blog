const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const auth = require('../Middleware/auth');

// Register
router.post('/register', async (req, res) => {
  const user = new User(req.body);
  console.log('req body ->', req.body);
  try {
    await user.save();
    // console.log('after user.save');
    const token = await user.generateAuthToken();
    // console.log('after token generation/before cookie token');
    //this is new code for cookies
    // res.cookie('token', token,{
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict'
    // });

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    // console.log('req.body from login ->', req.body);
    const user = await User.findByCredentials(req.body.userName, req.body.password);
    const token = await user.generateAuthToken();
    //new code for cookies
  //   res.cookie('token', token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'strict'
  // });

    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: 'Unable to login' });
  }
});

// Logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    //new code regarding cookies
    res.clearCookie('token');
  
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

//no router, all logic is handled here inside the route instead of routing to controller