const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token){
      throw new Error('No token found');
    }
    // console.log('before decoded in auth route');
    // console.log('JWT_SECRET:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');

    if (!decoded._id) {
      throw new Error('Token does not contain a valid user ID');
    }

    console.log('Searching for user with ID:', decoded._id);
    console.log('Searching for token:', token);

    
    // const user = await User.findById(decoded._id);
    
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    // console.log('after user ->', user);
    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
