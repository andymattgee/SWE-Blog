const jwt = require('jsonwebtoken');
const User = require('../Models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token){
      throw new Error('No token found');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');

    if (!decoded._id) {
      throw new Error('Token does not contain a valid user ID');
    }
    
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

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
