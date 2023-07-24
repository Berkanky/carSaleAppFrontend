const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    lastModified:{
        type:Number,
        required:false
    },
    name:{
        type:String,
        required:false
    },
    size:{
        type:Number,
        required:false
    },
    type:{
        type:String,
        required:false
    },
    webkitRelativePath:{
        type:String,
        required:false
    },
    fileUrl:{
        type:String,
        required:false
    }
})

const messageSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:false
    },
    messageId: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    selectedUserId:{
        type:String,
        required:true
    },
    senderPhoneNumber:{
        type:String,
        required:false
    },
    postId:{
        type:String,
        required:false
    },
    file:[fileSchema],
    userDetail:{
        type:mongoose.Schema.Types.Mixed,
        required:false
    }
  });

const myMessageSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    messages:[messageSchema],
    mails:[messageSchema]
});


const MyMessageSchema = mongoose.model('MyMessageSchema',myMessageSchema)
module.exports = MyMessageSchema
