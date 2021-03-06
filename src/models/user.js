const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
         type: String,
         trim: true,
         required: true,
         minlength: 1
    }, 
    email: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         unique: true,
         validate(value) {
             if (!validator.isEmail(value)) {
                 throw new Error('Invalid email address');
             }
         }
    },
    age: {
         type: Number,
         default: 0,
         validate(value) {
             if (value < 0) {
                 throw new Error('Negative age')
             }
         }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can not include "passworld"');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
        timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    
    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();
    
    return token;
};

userSchema.statics.findBycredential = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login!');
    }

    return user;
};

 // Hash the plain password before saving
 userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
 });    


 // Delete user tasks when user is removed

userSchema.pre('remove', async function (next) {
    const user = this;
    await task.deleteMany({ owner: user._id });

    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;