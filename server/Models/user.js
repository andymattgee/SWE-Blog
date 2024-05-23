const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {type: String, required: true},
        password: {type: String, required: true},
        email : {type: String, required: false},
        image : {type: String, required: false},
        entries:[{type: Schema.Types.ObjectId, ref: 'Entry'}]
    }
);

export const User = model('User', userSchema);