const mongoose = require('mongoose');
const onlyCarSchema = require('../carSale/onlyCarSchema')

const mySharedsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    incomingList:[]
})

const MySharedsSchema = mongoose.model('MySharedsSchema',mySharedsSchema)
module.exports = MySharedsSchema