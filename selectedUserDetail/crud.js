const express = require('express');
const app = express.Router();
const MyCarSalePosts = require('../carSale/myCarSalePosts')


 app.get('/:selectedUserId/selectedUserAllSalePosts',async(req,res)=>{
    const {selectedUserId} = req.params
    try{
        const selecteduserposts = await MyCarSalePosts.findOne({userId : selectedUserId})
        if(selecteduserposts){
            let selecteduserpostslist = selecteduserposts.myCarSalePostsList
            res.status(200).json({selecteduserpostslist})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
}) 


module.exports = app