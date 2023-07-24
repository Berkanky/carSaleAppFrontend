const express = require('express');
const app = express.Router();
const User = require('../userSchema/userSchema')
const MyNotifySchema = require('./schema')
const { v4: uuidv4 } = require('uuid');
const CarSchema = require('../carSale/carSchema')



//get decilned notify


const getdeclinednotifies = (allBody) => {
    
    let newList = []
    allBody.declinedsNotify.forEach(element => {
        const newData = {}
        const result = allBody.allUsersList.find(object => String(object._id) === String(element.userId))
        if(result){
            newData.userDetail = result
        }
        const findpost = allBody.allCarSalePosts.find(object => String(object.postId) === String(element.postId))
        if(findpost){
            newData.postDetail = findpost
        }
        newData.notifyDetail = element
        newList.push(newData)
    });
    return newList.length > 0 ? newList : []
}




// get postNotify
const getpostNotify = (allBody) => {
    let newList = []
    allBody.postNotify.forEach(element => {
        const result = allBody.allUsersList.find(object => String(object._id) === String(element.userId))
        if(result){
            const findPostDetail = allBody.allCarSalePosts.find(object => String(object.postId) ===  String(element.postId))
            if(findPostDetail){
                const message = `${result.email ?? result.name}` + ' Confirmed Your Offer Price'
                newList.push({userDetail:result,postDetail:findPostDetail,notifyDetail:element,message:message})
            }
        }
    });
    return newList.length > 0 ? newList : []
}

// follows Notify
const getFollowsNotify = (allBody) => {
    let newFollowsNotifyListDetail = []
    allBody.followsNotify.forEach(element => {
        const result = allBody.allUsersList.find(object => String(object._id) === String(element.userId))
        if(result){
            const message = `${result.email} Followed You.`
            newFollowsNotifyListDetail.push({userDetail:result,message:message, notifyId:element.notifyId})
        }
    });
    if(newFollowsNotifyListDetail.length > 0 ){
        return newFollowsNotifyListDetail
    }else{
        return []
    }
}


app.get('/:currentUserId/getMyNotifies',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allCarSalePosts = await CarSchema.find()
        let allUsersList = await User.find()
        if(allUsersList.length > 0 && allCarSalePosts.length > 0 ){
            const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
            if(mynotifies){
                const allBody = {
                    postNotify:mynotifies.postNotify,
                    followsNotify:mynotifies.followsNotify,
                    offersNotify:mynotifies.offersNotify,
                    allUsersList:allUsersList,
                    currentUserId:currentUserId,
                    allCarSalePosts:allCarSalePosts,
                    declinedsNotify:mynotifies.declinedsNotify
                }
                const notifyAllBody = {
                    followsNotify:getFollowsNotify(allBody),
                    postNotify:getpostNotify(allBody),
                    declinedsNotify:getdeclinednotifies(allBody)
                }
                res.status(200).json({notifyAllBody})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:currentUserId/:notifyId/removeFromFollowsNotify',async(req,res)=>{
    const {currentUserId, notifyId} = req.params
    try{
        const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
        if(mynotifies){
            mynotifies.followsNotify = mynotifies.followsNotify.filter(object => String(object.notifyId) !== String(notifyId))
            await mynotifies.save()
            res.status(200).json({mynotifies})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



//delete post notify


app.put('/:currentUserId/removePostNotify',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const allBody = req.body
        const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
        if(mynotifies){
            mynotifies.postNotify = mynotifies.postNotify.filter(object => String(object.postId) !== String(allBody.notifyDetail.postId))
            await mynotifies.save()
            res.status(200).json({mynotifies:mynotifies,removed:true})
        }else{
            res.status(200).json({removed:false})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:currentUserId/:notifyId/removeDeclinedNotify',async (req,res)=>{
    const {currentUserId, notifyId} = req.params
    try{
        const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
        if(mynotifies){
            mynotifies.declinedsNotify = mynotifies.declinedsNotify.filter(object => String(object.notifyId) !== String(notifyId))
            await mynotifies.save()
            res.status(200).json({mynotifies:mynotifies,removed:true})
        }
    }catch(err){

    }
})


//getonly pendingoffers

const findmyoffers = (allBody) => {
    let myofferedposts = []
    allBody.allCarSalePosts.forEach(element => {
        const checkme = element.offeredPrices.find(object => String(object.userId) === String(allBody.currentUserId))
        if(checkme){
            const check = String(element.confirmedSaleUser) === String(allBody.currentUserId) ? true : false
            myofferedposts.push({postDetail:element,priceDetail:checkme,confirmed:check})
        }
    }); 

    return myofferedposts.length > 0 ? myofferedposts : []
}

app.get('/:currentUserId/getOnlyPendingOffers',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allCarSalePosts = await CarSchema.find()
        if(allCarSalePosts.length > 0 ){
            const allBody = {
                allCarSalePosts,currentUserId
            }
            res.status(200).json({myofferedposts:findmyoffers(allBody)})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

//remove my pending offer

const removefromselectedusernotifies =async (allBody) => {
    const selecteduserschema = await MyNotifySchema.findOne({userId : allBody.findedpost.userDetail})
    if(selecteduserschema){
        selecteduserschema.offersNotify = selecteduserschema.offersNotify.filter(object => String(object.postId) !== String(allBody.selectedPostId))
        selecteduserschema.markModified('offersNotify')
        await selecteduserschema.save()
    }
}

app.put('/:currentUserId/:selectedPostId/removeMyOffer',async(req,res)=>{
    const  {currentUserId, selectedPostId} =  req.params
    try{
        const findedpost = await CarSchema.findOne({postId : selectedPostId})
        if(findedpost){

            const allBody = {
                currentUserId,selectedPostId,findedpost
            }
            removefromselectedusernotifies(allBody)
            findedpost.offeredPrices = findedpost.offeredPrices.filter(object => String(object.userId) !== String(currentUserId))
            await findedpost.save()
            res.status(200).json({findedpost:findedpost,removed:true})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


module.exports = app