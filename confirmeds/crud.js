const express = require('express');
const app = express.Router();
const CarSchema = require('../carSale/carSchema')
const User = require('../userSchema/userSchema')
const MyCarSalePosts = require('../carSale/myCarSalePosts')


app.get('/:currentUserId/getAllConfirmeds',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allCarSalePosts = await CarSchema.find()
        if(allCarSalePosts.length > 0 ){
            let allConfirmedCarSalePosts = []
            allCarSalePosts.forEach(element => {
                if(String(element.confirmedSaleUser) === String(currentUserId)){
                    allConfirmedCarSalePosts.push(element)
                }
            });
            res.status(200).json({allConfirmedCarSalePosts})
        }else{
            res.status(200).json({allConfirmedCarSalePosts:[]})
        }
    }catch(err){
        res.status(200).json({message:'Internal Server Error'})
    }
})


app.put('/:currentUserId/cancelConfirmed',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const postDetail = req.body
        const selectedpost = await CarSchema.findOne({postId : postDetail.postId})
        if(selectedpost){
            if(selectedpost.confirmedSaleUser && String(selectedpost.confirmedSaleUser) === String(currentUserId)){
                selectedpost.confirmedSaleUser = ''
                await selectedpost.save()
                res.status(200).json({selectedpost:selectedpost,removed:true})
            }
        }else{
            res.status(200).json({removed:false})
        }
    }catch(err){
        res.status(200).json({message:'Internal Server Error'})
    }
})


const findofferedprice = (allBody) => {
    const myofferedprice = allBody.selectedpost.offeredPrices.find(object => String(object.userId) === String(allBody.currentUserId))
    if(myofferedprice){
        return myofferedprice
    }else{
        return {}
    }
}

app.get('/:currentUserId/:selectedPostId/getMoreDetailConfirmedPrice',async(req,res)=>{
    const {currentUserId,selectedPostId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        if(selectedpost){
            const allBody = {
                currentUserId:currentUserId,
                selectedPostId:selectedPostId,
                selectedpost:selectedpost
            }
            res.status(200).json({detailOfferedPrice:findofferedprice(allBody)})
        }
    }catch(err){
        res.status(200).json({message:'Internal Server Error'})
    }
})


app.get('/:currentUserId/:selectedPostId/getSelectedPostConfirmedDetail',async(req,res)=>{
    const {currentUserId, selectedPostId} = req.params
    try{
        let allUsersList = await User.find()
        if(allUsersList.length > 0 ){
            const newData = {}
            const selectedpostdetail = await CarSchema.findOne({postId : selectedPostId})
            if(selectedpostdetail){
                if(selectedpostdetail.confirmedSaleUser){
                    const result = allUsersList.find(object => String(object._id) === String(selectedpostdetail.confirmedSaleUser))
                    if(result){
                        newData.userDetail = result
                    }
    
                    const pricedetail = selectedpostdetail.offeredPrices.find(object => String(object.userId) === String(selectedpostdetail.confirmedSaleUser))
                    if(pricedetail){
                        newData.priceDetail = pricedetail
                    }
                    newData.postDetail = selectedpostdetail
                    res.status(200).json({confirmedSaleUserDetail:newData})
                }else{
                    res.status(200).json({message:'Cant Found'})
                }
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


const removefrommyposts = async (allBody) => {
    const findpostinmyposts = allBody.myCarSalePosts.myCarSalePostsList.find(object => String(object.postId) === String(allBody.selectedPostId))
    if(findpostinmyposts){
        findpostinmyposts.confirmedSaleUser = ''
        //selectedPost.markModified('offeredPrices')
        allBody.myCarSalePosts.markModified('myCarSalePostsList')
        await allBody.myCarSalePosts.save()
    }
}

app.put('/:currentUserId/:selectedPostId/removeConfirmedSaleUser',async (req,res)=>{
    const {currentUserId, selectedPostId} = req.params
    try{
        const myCarSalePosts = await MyCarSalePosts.findOne({userId : currentUserId})
        if(myCarSalePosts){
            const allBody = {
                myCarSalePosts:myCarSalePosts,
                selectedPostId:selectedPostId
            }
            removefrommyposts(allBody)
        }
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        if(selectedpost){
            selectedpost.confirmedSaleUser = ''
            await selectedpost.save()
            res.status(200).json({selectedpost:selectedpost,removed:true})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})






module.exports = app