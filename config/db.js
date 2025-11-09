const mongoose = require("mongoose")
const dotenv = require("dotenv").config()

const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log("DATABASE CONNECTED")
    }
    catch(error){
        console.log(error)
    }
}

module.exports = connectDB;
