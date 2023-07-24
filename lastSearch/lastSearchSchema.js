const mongoose = require('mongoose');
const schemaEachSearchs = new mongoose.Schema({
    search:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})


const LastSearchSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    lastSearchsList:[schemaEachSearchs]
})

const LastSearch = mongoose.model('LastSearch',LastSearchSchema)
module.exports = LastSearch

