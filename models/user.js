const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type : String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    age: Number,

})

const User = mongoose.model('User', userSchema);

module.exports = User