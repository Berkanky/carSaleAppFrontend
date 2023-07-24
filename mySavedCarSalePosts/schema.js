const mongoose = require('mongoose');

const MySavedCarSalePostsSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    mySavedCarSalePostsList:[mongoose.Schema.Types.Mixed]
})

const MySavedCarSalePost = mongoose.model('MySavedCarSalePost',MySavedCarSalePostsSchema)
module.exports = MySavedCarSalePost





