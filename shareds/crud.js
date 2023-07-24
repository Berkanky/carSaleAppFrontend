const express = require('express');
const app = express.Router();
const MySharedsSchema = require('./schema')
const User = require('../userSchema/userSchema')
const CarSchema = require('../carSale/carSchema')
const { v4: uuidv4 } = require('uuid');

app.post('/:currentUserId/:selectedUserId/sendPost',async(req,res)=>{
    const {currentUserId,selectedUserId} =  req.params
    try{
        const currentPost = req.body.currentPost
        delete currentPost._id
        delete currentPost.confirmedSaleUser
        const selecteduserschema = await MySharedsSchema.findOneAndUpdate(
            {userId : selectedUserId},
            {$push : {incomingList : {postId:currentPost.postId,senderId:currentUserId,sendedId:selectedUserId,date:new Date().toLocaleString(),sharedId:uuidv4()}}},
            {new:true,upsert:true}
        )
        const myschema  = await MySharedsSchema.findOneAndUpdate(
            {userId : currentUserId},
            {$push : {incomingList : {postId:currentPost.postId,senderId:currentUserId,sendedId:selectedUserId,date:new Date().toLocaleString(),sharedId:uuidv4()}}},
            {new:true,upsert:true}
        )
        res.status(200).json({selecteduserschema,myschema})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.get('/:currentUserId/getMyShareds',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allUsers = await User.find()
        let allCarSalePosts = await CarSchema.find()
        const myshareds = await MySharedsSchema.findOne({userId : currentUserId})
        if(myshareds){
            let mySendedList = []
            let myReceivedList  = []
            myshareds.incomingList.forEach(element => {
                const newData = {}
                newData.sharedId = element.sharedId
                newData.date = element.date ?? 'No Date'
                const result = allCarSalePosts.find(object => String(object.postId) === String(element.postId))
                if(result){
                    newData.postDetail = result
                    const findSender = allUsers.find(object => String(object._id) === String(element.senderId))
                    if(findSender){
                        newData.senderDetail = findSender
                    }
                    const findSended = allUsers.find(object => String(object._id) === String(element.sendedId))
                    if(findSended){
                        newData.sendedDetail  = findSended
                    }
                    if(newData.senderDetail){
                        if(String(newData.senderDetail._id) === String(currentUserId)){
                            mySendedList.push(newData)
                        }else{
                            myReceivedList.push(newData)
                        }
                    }
                }
            });
            let allSharedList = [
                ...mySendedList,
                ...myReceivedList
            ]
            res.status(200).json({mySendedList,myReceivedList,allSharedList})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/:selectedSharedId/removeFromShareds',async(req,res)=>{
    const {currentUserId,selectedSharedId} = req.params
    try{
        const myshareds = await MySharedsSchema.findOne({userId : currentUserId})
        if(myshareds){
            myshareds.incomingList = myshareds.incomingList.filter(object => String(object.sharedId) !== String(selectedSharedId))
            await myshareds.save()
            res.status(200).json({myshareds})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/:selectedSharedId/checkDeletedOrNot',async(req,res)=>{
    const {currentUserId,selectedSharedId} = req.params
    try{
        const selectedSharedPost = req.body.selectedSharedPost
        const findedPost = await CarSchema.findOne({postId : selectedSharedPost.postDetail.postId})
        if(!findedPost){
            res.status(200).json({removed:true,findedPost:{}})
        }else{
            res.status(200).json({removed:false,findedPost})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server error'})
    }
})



module.exports = app