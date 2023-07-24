const express = require('express');
const app = express.Router();
const MyNotifySchema = require('../notify/schema')
const CarSchema = require('../carSale/carSchema')
const User = require('../userSchema/userSchema')


const getdetails = (allBody) => {
    let newList = []
    allBody.declinedsNotify.forEach( (element) => {
        const result = allBody.allUsersList.find(object => String(object._id) === String(element.userId))
        if(result){
            const findedPost = allBody.allCarSalePostsList.find(object => String(object.postId) === String(element.postId))
            if(findedPost){
                const newData = {
                    userDetail:result,
                    notifyDetail:element,
                    postDetail:findedPost
                }
                newList.push(newData)
            }
        }
    });

    return newList.length > 0 ? newList : [{userDetail:{},notifyDetail:{message:'No Info'},postDetail:{}}]
}


app.get('/:currentUserId/getDeclinedOffers',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allUsersList =  await User.find()
        let allCarSalePostsList = await CarSchema.find()
        if(allUsersList.length > 0 && allCarSalePostsList.length > 0){
            const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
            if(mynotifies){
                const allBody = {
                    declinedsNotify:mynotifies.declinedsNotify,
                    allUsersList:allUsersList,
                    allCarSalePostsList:allCarSalePostsList
                }

                res.status(200).json({declinedsNotify:getdetails(allBody)})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

const removeFromDeclinedsFunction =async (allBody) => {
    allBody.mynotifies.declinedsNotify = allBody.mynotifies.declinedsNotify.filter(object => String(object.notifyId) !== String(allBody.selectedData.notifyDetail.notifyId))
    await allBody.mynotifies.save()
}


app.put('/:currentUserId/removeFromDeclinedsNotify',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
        if(mynotifies){
            const selectedData = req.body.selectedData
            const allBody = {currentUserId,selectedData,mynotifies}
            removeFromDeclinedsFunction(allBody)
            res.status(200).json({mynotifies:mynotifies,removed:true})
        }
        
    }catch(err){    
        res.status(500).json({message:'Internal Server Error'})
    }
})


module.exports = app