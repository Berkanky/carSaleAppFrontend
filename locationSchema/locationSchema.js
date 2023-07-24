const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema({
    city:{
        type:String,
        required:false
    },
    country:{
        type:String,
        required:false
    },
    fullAddress:{
        type:String,
        required:false
    },
    lat:{
        type:String,
        required:false
    },
    lng:{
        type:String,
        required:false
    }
})

module.exports = LocationSchema