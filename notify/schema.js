const mongoose = require('mongoose')


const myNotifySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    followsNotify:[],
    offersNotify:[],
    postNotify:[],
    declinedsNotify:[]
})

const MyNotifySchema = mongoose.model('MyNotifySchema',myNotifySchema)
module.exports = MyNotifySchema