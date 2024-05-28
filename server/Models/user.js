const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;

const userSchema = new Schema({
        userName: {type: String, required: true},
        password: {type: String, required: true},
        email : {type: String, required: false},
        image : {type: String, required: false},
        entries:[{type: Schema.Types.ObjectId, ref: 'Entry'}],
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    });

    userSchema.pre('save', async function(next) {
        const user = this;
        if (user.isModified('password')) {
          user.password = await bcrypt.hash(user.password, 8);
        }
        next();
      });
      
      userSchema.methods.generateAuthToken = async function() {
        // console.log('entered gen token');
        const user = this;
        const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
        console.log('after gen token jwt assignment | token ->', token);
        user.tokens = user.tokens.concat({ token });
        console.log('after user.tokens');
        await user.save();
        return token;
      };
      
      userSchema.statics.findByCredentials = async (userName, password) => {
        const user = await User.findOne({ userName });
        if (!user) {
          throw new Error('Unable to login');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Unable to login');
        }
        return user;
      };

      const User = mongoose.model('User', userSchema);

module.exports = User;