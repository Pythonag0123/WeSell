const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        trim: true,
        required: true
    },
    email : {
        type: String,
        trim: true,
        required: true
    },
    phone : {
        type: Number,
        trim: true,
        required: true
    },
    dob : {
        type: String,
        trim: true,
        required: true
    },
    gender : {
        type: String,
        trim: true,
        required: true
    },
    role : {
        type: String,
        trim: true,
        required: true
    },
    
},{timestamps: true})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);