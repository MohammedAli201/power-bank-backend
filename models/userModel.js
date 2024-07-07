const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false   
    },
    confirm_password: {

        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    next();
});
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
const user = mongoose.model('user', userSchema);
module.exports = user;

