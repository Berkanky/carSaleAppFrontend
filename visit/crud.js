const express = require('express');
const app = express.Router();
const MyVisitsSchema = require('./schema')
const { v4: uuidv4 } = require('uuid');
const CarSchema = require('../carSale/carSchema');
const User = require('../userSchema/userSchema');

app.post('/:currentUserId/:selectedCarSalePostId/addToMyVisits',async(req,res)=>{
    const {currentUserId,selectedCarSalePostId} = req.params
    try{
        let allCarSalePost = await CarSchema.find()
        if(allCarSalePost.length > 0 ){
            const result = allCarSalePost.find(object => String(object.postId) === String(selectedCarSalePostId))
            if(result){
                const checkInOrNot = result.visiters.some(object => object.currentUserId === currentUserId)
                if(!checkInOrNot){
                    result.visiters.push({currentUserId})
                    await result.save()
                }
            }
        }
        const myvisitschema = await MyVisitsSchema.findOne({userId : currentUserId})
        if(!myvisitschema){
            const updatedData = {
                visitId:uuidv4(),
                date:new Date().toLocaleString(),
                postId:selectedCarSalePostId
            }
            const myvisitschema = await MyVisitsSchema.findOneAndUpdate(
                {userId : currentUserId},
                {$push : {visits : updatedData}},
                {new:true,upsert:true}
            )
            res.status(200).json({updatedData})
        }else{
            const result = myvisitschema.visits.find(object => String(object.postId) === String(selectedCarSalePostId))
            if(!result){
                const updatedData = {
                    visitId:uuidv4(),
                    date:new Date().toLocaleString(),
                    postId:selectedCarSalePostId
                }
                myvisitschema.visits.push(updatedData)
                await myvisitschema.save()
                res.status(200).json({updatedData})
            }else{
                const finded = await MyVisitsSchema.findOne(
                    {userId : currentUserId}
                )
                const findandupdate  = finded.visits.find(object => String(object.postId) === String(selectedCarSalePostId))
                if(findandupdate){
                    const updatedData = {
                        date:new Date().toLocaleString(),
                        visitId:findandupdate.visitId,
                        postId:findandupdate.postId
                    }
                    findandupdate.date  = updatedData.date
                    finded.markModified('visits');
                    await finded.save()
                    res.status(200).json({finded,findandupdate,updatedData})
                }
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


//get selectedpost all visits

app.get('/:currentUserId/:selectedCarSalePostId/getSelectedPostAllVisits',async(req,res)=>{
    const {currentUserId,selectedCarSalePostId} = req.params
    try{
        let allUsersList = await User.find()
        if(allUsersList.length > 0 ){
            const selectedpostvisits = await CarSchema.findOne({postId : selectedCarSalePostId})
            if(selectedpostvisits){
                let visitersList = selectedpostvisits.visiters.length > 0 ? selectedpostvisits.visiters : []
                let newList = []
                visitersList.forEach(element => {
                    const result = allUsersList.find(object => String(object._id) === String(element.currentUserId))
                    if(result){
                        const newData = result
                        newList.push(newData)
                    }
                });
                res.status(200).json({visiters:newList.length > 0 ? newList : []})
            }else{
                res.status(200).json({message:'Cant Found'})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:currentUserId/:selectedCarSalePostId/getSelectedPostVisitDetail',async(req,res)=>{
    const {currentUserId,selectedCarSalePostId} = req.params
    try{
        const myvisitschema = await MyVisitsSchema.findOne({userId : currentUserId})
        if(myvisitschema){
            const result = myvisitschema.visits.find(object => String(object.postId) === String(selectedCarSalePostId))
            if(result){
                res.status(200).json({result})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.get('/:currentUserId/getMyAllVisits',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const myvisitschema = await MyVisitsSchema.findOne({userId : currentUserId})
        if(myvisitschema){
            res.status(200).json({allVisits:myvisitschema.visits})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

//getallmyvisitsi update et

app.get('/:currentUserId/getMyAllVisitsWithDetail',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allCarSalePosts = await CarSchema.find()
        const myvisitschema = await MyVisitsSchema.findOne({userId : currentUserId})
        if(myvisitschema){
            let visitsList = []
            myvisitschema.visits.forEach(element => {
                const result = allCarSalePosts.find(object => String(object.postId) === String(element.postId))
                if(result){
                    const newData = {
                        postDetail:result,
                        date:element.date,
                        visitId:element.visitId,
                        postId:element.postId
                    }
                    visitsList.push(newData)
                }
            });
            res.status(200).json({visitsList})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/:visitId/removeFromVisits',async(req,res)=>{
    const {currentUserId, visitId} = req.params
    try{
        let myvisitschema = await MyVisitsSchema.findOne({userId : currentUserId})
        if(myvisitschema){
            myvisitschema.visits = myvisitschema.visits.filter(object => String(object.visitId) !== String(visitId))
            await myvisitschema.save()
            res.status(200).json({myvisitschema})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/removeAllFromVisits',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const myvisitschema = await MyVisitsSchema.findOne({userId : currentUserId})
        if(myvisitschema){
            let deleteList  = req.body.deleteList
            myvisitschema.visits.forEach(element => {
                const result = deleteList.some(object => String(object.visitId) === String(element.visitId))
                if(result){
                    myvisitschema.visits = myvisitschema.visits.filter(object => String(object.visitId) !== String(element.visitId))
                }
            });
            await myvisitschema.save()
            res.status(200).json({myvisitschema})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

module.exports = app