const mongoose = require('mongoose');

const imageObjSchema = new mongoose.Schema({
    image:{
      type:String,
      required:false
    },
    imageId:{
      type:String,
      required:false
    },
    inDb:{
      type:Boolean,
      required:false
    }
  })



  module.exports = imageObjSchema