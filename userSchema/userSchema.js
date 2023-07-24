const mongoose = require('mongoose');
const imageObjSchema = require('../imageObjSchema/imageObjSchema')
const LocationSchema = require('../locationSchema/locationSchema')
const User = mongoose.model('User', {
    email:{
      type:String,
      required:false
    },
    firebaseUserId:{
      type:String,
      required:false
    },
    phoneNumber:{
      type:String,
      required:false
    },
    name: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    age:{
      type:String,
      required:false
    },
    authType:{
      type:String,
      required:false
    },
    description:{
      type:String,
      required:false
    },
    job:{
      type:String,
      required:false
    },
    userImage:{
      type:String,
      required:false
    },
    password:{
      type:String,
      required:false
    },
    userImages:[imageObjSchema],
    date: {
      type: Date,
      default: Date.now,
      required: false,
    },
    online:{
      type:Boolean,
      required:false,
    },
    locationDetails:{
      type:LocationSchema,
      required:false
    },
    communicationNumber:{
      type:String,
      required:false
    }
  });


  module.exports = User