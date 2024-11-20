const mongoose = require('mongoose');

const stuffSchema = new mongoose.Schema({
    name: String,
    value: Number,
    isOwned: Boolean,
    owner: String,
});

const Stuff = mongoose.model('Stuff', stuffSchema);

module.exports = Stuff