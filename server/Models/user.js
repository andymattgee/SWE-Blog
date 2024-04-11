import {model, Schema} from 'mongoose';

const userSchema = new Schema(
    {
        userName: {type: String, required: true},
        password: {type: String, required: true},
        email : {type: String, required: false},
        image : {type: String, required: false}
    }
);

export const User = model('User', userSchema);