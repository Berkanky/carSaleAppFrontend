const mongoose = require('mongoose');


const myFollowListsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    followList:[],
    followerList:[]
})

const MyFollowListsSchema = mongoose.model('myFollowListsSchema',myFollowListsSchema)
module.exports = MyFollowListsSchema