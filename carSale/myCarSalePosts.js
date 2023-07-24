const mongoose = require('mongoose');
const CarSchema = require('./carSchema')

const MyCarSalePostsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    myCarSalePostsList: [mongoose.Schema.Types.Mixed]
});

const MyCarSalePosts = mongoose.model('MyCarSalePosts', MyCarSalePostsSchema);
module.exports = MyCarSalePosts;