const mongoose = require('mongoose');

const myVisitsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    visits:[]
})


const MyVisitsSchema = mongoose.model('MyVisitsSchema',myVisitsSchema)
module.exports = MyVisitsSchema
