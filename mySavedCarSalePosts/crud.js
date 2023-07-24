const express = require('express');
const app = express.Router();

const MySavedCarSalePost = require('./schema');
const CarSchema = require('../carSale/carSchema');
const User = require('../userSchema/userSchema')

app.get('/:currentUserId/getMySavedPostsList',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allCarSalePosts = await CarSchema.find()
        const mySavedCarSalePost = await MySavedCarSalePost.findOne({userId : currentUserId})
        if(allCarSalePosts.length > 0){
            if(mySavedCarSalePost){
                let mySavedList = []
                mySavedCarSalePost.mySavedCarSalePostsList.forEach(element => {
                    const result = allCarSalePosts.find(object => String(object.postId) === String(element.postId))
                    if(result){
                        mySavedList.push(result)
                    }
                });
                res.status(200).json({mySavedList,mySavedCarSalePost})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.post('/:currentUserId/addMySavedPostsList',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let mycarsaleposts = await MySavedCarSalePost.findOne({userId : currentUserId})
        if(!mycarsaleposts){
            const mySavedCarSalePost = await MySavedCarSalePost.findOneAndUpdate(
                {userId : currentUserId},
                {$push : {mySavedCarSalePostsList : {postId:req.body.postId,_id:req.body._id}}},
                {new:true,upsert:true}
            )
            res.status(200).json({mySavedCarSalePost}) 
        }else{
            const result = mycarsaleposts.mySavedCarSalePostsList.some(object => String(object.postId) === String(req.body.postId))
            if(!result){
                mycarsaleposts.mySavedCarSalePostsList.push({postId:req.body.postId,_id:req.body._id})
                await mycarsaleposts.save()
                res.status(200).json({mycarsaleposts})
            }else{
                mycarsaleposts.mySavedCarSalePostsList = mycarsaleposts.mySavedCarSalePostsList.filter(object => String(object.postId) !== String(req.body.postId))
                await mycarsaleposts.save()
                res.status(200).json({mycarsaleposts,removed:true})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:selectedCarSalePostId/getSelectedPostDetail',async(req,res)=>{
    const {selectedCarSalePostId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedCarSalePostId})
        if(selectedpost){
            res.status(200).json({selectedpost})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:selectedCarSalePostId/getCreaterDetail',async(req,res)=>{
    const {selectedCarSalePostId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedCarSalePostId})
        if(selectedpost){
            const createrdetail = await User.findOne({_id : selectedpost.userDetail})
            if(createrdetail){
                res.status(200).json({createrdetail})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:currentUserId/:selectedPostId/checkInAllSalePost',async(req,res)=>{
    const {currentUserId,selectedPostId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        if(selectedpost){
            res.status(200).json({selectedpost,removed:false})
        }else{
            res.status(200).json({removed:true})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/:selectedPostId/removeFromSavedsAfterCheck',async(req,res)=>{
    const {currentUserId,selectedPostId} = req.params
    try{
    const selectedpost = await MySavedCarSalePost.findOne({userId : currentUserId}) 
    if(selectedpost){
        selectedpost.mySavedCarSalePostsList = selectedpost.mySavedCarSalePostsList.filter(object => String(object.postId) !== String(selectedPostId))
        await selectedpost.save()
        res.status(200).json({selectedpost})
    }   
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



app.get('/:currentUserId/:selectedPostId/getSelectedPostImages',async(req,res)=>{
    const {currentUserId,selectedPostId} = req.params
    try{
        const currentPost = await CarSchema.findOne({postId : selectedPostId})
        if(currentPost){
            let imageList = currentPost.carImages
            const mainImage = currentPost.mainImage ?? ''
            if(mainImage != '' && mainImage != null){
                const result = imageList.some(object => object.image === mainImage)
                if(!result){
                    const newId = imageList.length + 1
                    imageList.push({id:newId,image:mainImage})
                }
            }
            res.status(200).json({imageList,mainImage})
        }
    }catch(err){

    }
})



module.exports = app