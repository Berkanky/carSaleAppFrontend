const express = require('express');
const app = express.Router();
const { v4: uuidv4 } = require('uuid');
const CarSchema = require('../carSale/carSchema');
const User = require('../userSchema/userSchema')
const MyFollowListsSchema = require('./schema')
const MyNotifySchema = require('../notify/schema')

//add me to selected user followerList

const addToSelectedUserFollowerListFunction = async (paramsObject) => {
    const selectedUserSchema  = await MyFollowListsSchema.findOne({userId : paramsObject.selectedUserId})
    if(!selectedUserSchema){
        const createselecteduserschema = await MyFollowListsSchema.findOneAndUpdate(
            {userId : paramsObject.selectedUserId},
            {$push : {followerList : {userId : paramsObject.currentUserId}}},
            {new:true,upsert:true}
        )
    }else{
        const result = selectedUserSchema.followerList.find(object => String(object.userId) === String(paramsObject.currentUserId))
        if(!result){
            selectedUserSchema.followerList.push({userId : paramsObject.currentUserId})
            await selectedUserSchema.save()
        }else{
            selectedUserSchema.followerList = selectedUserSchema.followerList.filter(object => String(object.userId) !== String(paramsObject.currentUserId))
            await selectedUserSchema.save()
        }
    }
}


//send notify to selected user

const sendNotify = async (paramsObject) => {
    const selectedusernotify = await MyNotifySchema.findOne({userId : paramsObject.selectedUserId})
    if(selectedusernotify){
        const newData = {
            userId : paramsObject.currentUserId,
            notifyId:uuidv4()
        }
        const result = selectedusernotify.followsNotify.some(object => String(object.userId) === String(paramsObject.currentUserId))
        if(!result){
            selectedusernotify.followsNotify.push(newData)
            await selectedusernotify.save()
        }
    }else{
        const selectedusernotify = await MyNotifySchema.findOneAndUpdate(
            {userId : paramsObject.selectedUserId},
            {$push : {followsNotify : {userId : paramsObject.currentUserId,notifyId:uuidv4()}}},
            {new:true,upsert:true}
        )
    }
}

const clearNotify = async (paramsObject) => {
    const selectedusernotify = await MyNotifySchema.findOne(
        {userId : paramsObject.selectedUserId}
    )
    if(selectedusernotify){
        const result = selectedusernotify.followsNotify.some(object => String(object.userId) === String(paramsObject.currentUserId))
        if(result){
            selectedusernotify.followsNotify = selectedusernotify.followsNotify.filter(object => String(object.userId) !== String(paramsObject.currentUserId))
            await selectedusernotify.save()
        }
    }
}



//add myfollowlist
app.post('/:currentUserId/:selectedUserId/addMyFollowList',async(req,res)=>{
    const {currentUserId, selectedUserId} = req.params
    try{
        const paramsObject = {
            currentUserId:req.params.currentUserId,
            selectedUserId:req.params.selectedUserId
        }
        addToSelectedUserFollowerListFunction(paramsObject)
        const myFollowListsSchema = await MyFollowListsSchema.findOne({userId : currentUserId})
        if(!myFollowListsSchema){
            const createnewMyFollowListsSchema = await MyFollowListsSchema.findOneAndUpdate(
                {userId : currentUserId},
                {$push : {followList : {userId:selectedUserId}}},
                {new:true,upsert:true}
            )
            sendNotify(paramsObject)
            res.status(200).json({createnewMyFollowListsSchema,removed:false})
        }else{
            const result = myFollowListsSchema.followList.find(object => String(object.userId) === String(selectedUserId))
            if(!result){
                myFollowListsSchema.followList.push({userId : selectedUserId})
                await myFollowListsSchema.save()
                sendNotify(paramsObject)
                res.status(200).json({myFollowListsSchema,removed:false})
            }else if(result){
                myFollowListsSchema.followList = myFollowListsSchema.followList.filter(object => String(object.userId) !== String(selectedUserId))
                await myFollowListsSchema.save()
                clearNotify(paramsObject)
                res.status(200).json({myFollowListsSchema,removed:true})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:currentUserId/getMyfolls',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const myfollowlist = await MyFollowListsSchema.findOne({userId : currentUserId})
        if(myfollowlist){
            res.status(200).json({myfollowlist})
        }else{
            res.status(200).json({myfollowlist : {}})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


const getFollowList = (allBody) => {
    let followList = []
    allBody.myfollowlist.followList.forEach(element => {
        const result = allBody.allUserList.find(object => String(object._id) === String(element.userId))
        if(result){
            followList.push(result)
        }
    });

    let newDetailFollowList = followList.length > 0 ? followList : []
    return newDetailFollowList

}

const getFollowerList = (allBody) =>{
    let followerList = []
    allBody.myfollowlist.followerList.forEach(element => {
        const result = allBody.allUserList.find(object => String(object._id) === String(element.userId))
        if(result){
            followerList.push(result)
        }
    })
    let newFollowerList = followerList.length > 0 ? followerList : []
    return newFollowerList
}


app.get('/:currentUserId/getMyFollsDetails',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allUserList = await User.find()
        if(allUserList.length > 0 ){
            const myfollowlist = await MyFollowListsSchema.findOne({userId : currentUserId})
            if(myfollowlist){
                const allBody = {
                    allUserList: allUserList,
                    myfollowlist:myfollowlist
                }
                const followList = getFollowList(allBody)
                const followerList =  getFollowerList(allBody)
                const allResultData = {
                    followList,followerList
                }
                res.status(200).json({allResultData})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


//search in your  follows


app.post('/:currentUserId/findInFollowsAndFollowers',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allUsersList = await User.find()
        if(allUsersList.length > 0 ){
            let findUserVal = req.body.findUserVal
            const myfollowlist = await MyFollowListsSchema.findOne({userId : currentUserId})
            if(myfollowlist){
                let allList = [...myfollowlist.followList,...myfollowlist.followerList]
                let allListUnique = []
                
                allList.forEach(element => {
                    const result = allListUnique.some(object => object.userId === element.userId)
                    if(!result){
                        allListUnique.push(element)
                    }
                });
                let allListUniqueDetail = []
                allListUnique.forEach(element => {
                    const result = allUsersList.find(object => String(object._id) === String(element.userId))
                    if(result){
                        allListUniqueDetail.push(result)
                    }
                });
                
                let findedUsers = allListUniqueDetail.filter(object => {
                    const withemail = (object.email.toLowerCase()).includes(findUserVal.toLowerCase())
                    const withname = (object.name.toLowerCase()).includes(findUserVal.toLowerCase())

                    return withemail || withname
                })
                const findedCheck = findedUsers.length > 0 ? true : false
                res.status(200).json({findedUsers,findedCheck})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



module.exports = app