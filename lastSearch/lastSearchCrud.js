const express = require('express');
const app = express.Router();
const LastSearch = require('./lastSearchSchema')



app.post('/:currentUserId/postToLastSearch',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const newPost = {
            search:req.body.search
        }
        let mylastsearch = await LastSearch.findOne({userId : currentUserId})
        if(mylastsearch && mylastsearch.lastSearchsList.length < 4){
            const result = mylastsearch.lastSearchsList.find(object => object.search === newPost.search)
            if(!result){
                mylastsearch = await LastSearch.findOneAndUpdate(
                    {userId : currentUserId},
                    {$push : {lastSearchsList: newPost}},
                    {new:true,upsert:true}
                )
                res.status(200).json({mylastsearch})
            }
        }else if(!mylastsearch){
            const mylastsearch = await LastSearch.findOneAndUpdate(
                {userId : currentUserId},
                {$push : {lastSearchsList: newPost}},
                {new:true,upsert:true}
            )
            res.status(200).json({mylastsearch})
        }else if(mylastsearch.lastSearchsList.length  === 4){
            mylastsearch = await LastSearch.findOneAndUpdate(
                { userId: currentUserId },
                { $pop: { lastSearchsList: 1 } },
                { new: true }
            )
            const result = mylastsearch.lastSearchsList.find(object => object.search === newPost.search)
            if(!result){
                mylastsearch.lastSearchsList.push(newPost)
                await mylastsearch.save()
            }
            res.status(200).json({mylastsearch})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.get('/:currentUserId/getAllLastSearchs',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        const mylastsearch = await LastSearch.findOne({
            userId : currentUserId
        })
        if(mylastsearch){
            res.status(200).json({mylastsearch})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})




module.exports = app