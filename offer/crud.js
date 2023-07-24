const express = require('express');
const app = express.Router();
const User = require('../userSchema/userSchema')
const CarSchema = require('../carSale/carSchema')
const MyNotifySchema = require('../notify/schema')
const { v4: uuidv4 } = require('uuid');
const MyCarSalePosts = require('../carSale/myCarSalePosts')

//when offer price sended notify to selected user

const updateMyCarSchemaAfterNewOfferedPrice = async (sendBody) => {
    const postdetail  = await CarSchema.findOne({postId : sendBody.selectedPostId})
    if(postdetail){
        const mycarsaleschema = await MyCarSalePosts.findOne({userId : postdetail.userDetail})
        if(mycarsaleschema){
            const findpost = await mycarsaleschema.myCarSalePostsList.find(object => String(object.postId) === String(sendBody.selectedPostId))
            if(findpost){
                const check = sendBody.updated === true ? true : false
                if(check){
                    findpost.confirmedSaleUser = ''
                    mycarsaleschema.markModified('myCarSalePostsList')
                    await mycarsaleschema.save()
                }
            }
        }
    }
}



const deletefromdeclinedsifin = async (allBody) => {
    const mynotifies = await MyNotifySchema.findOne({userId : allBody.currentUserId})
    if(mynotifies){
        const result = mynotifies.declinedsNotify.some(object => String(object.postId) === String(allBody.selectedPostId))
        if(result){
            mynotifies.declinedsNotify = mynotifies.declinedsNotify.filter(object => String(object.postId) !== String(allBody.selectedPostId))
            mynotifies.markModified('declinedsNotify')
            await mynotifies.save()
        }
    }
}

const sendNotifyWhenOfferPrice = async (allBody) => {
    const findpostdetail = await CarSchema.findOne({postId : allBody.selectedPostId})
    if(findpostdetail){
        //zaten daha önceyapılan bir teklif senin tarafından yapıldıysa onu güncelle ve bildirim yolla 2 tarafada
        if(findpostdetail.confirmedSaleUser !== '' && findpostdetail.confirmedSaleUser !== null && String(findpostdetail.confirmedSaleUser) === String(allBody.currentUserId)){
            findpostdetail.confirmedSaleUser = ''
            await findpostdetail.save()
        }
        const selectednotify = await MyNotifySchema.findOne({userId : findpostdetail.userDetail})
        if(selectednotify){
            const result = selectednotify.offersNotify.find(object => String(object.userId) === String(allBody.currentUserId) && String(object.postId) === String(allBody.selectedPostId))
            if(!result){
                const notifyData = {
                    notifyId:uuidv4(),
                    userId:allBody.currentUserId,
                    postId:allBody.selectedPostId,
                    price:allBody.priceData.price,
                    updated:false,
                    date:new Date().toLocaleString(),
                }
                selectednotify.offersNotify.push(notifyData)
                await selectednotify.save()
            }else{
                result.price = allBody.priceData.price
                result.date = new Date().toLocaleString()
                result.updated = true

                const sendBody = {
                    updated:result.updated,
                    currentUserId:allBody.currentUserId,
                    selectedPostId:allBody.selectedPostId
                }
                updateMyCarSchemaAfterNewOfferedPrice(sendBody)
                selectednotify.markModified('offersNotify')
                await selectednotify.save()
            } 
        }else{
            const notifyData = {
                notifyId:uuidv4(),
                userId:allBody.currentUserId,
                postId:allBody.selectedPostId,
                price:allBody.priceData.price,
                date:new Date().toLocaleString(),
            }
            const selectednotify = await MyNotifySchema.findOneAndUpdate(
                {userId:findpostdetail.userDetail},
                {$push : {offersNotify : notifyData}},
                {new:true,upsert:true}
            )
        }
    }
}




app.put('/:currentUserId/:selectedPostId/addOfferedPrice',async(req,res)=>{
    const {currentUserId, selectedPostId} = req.params
    try{
        const priceData = req.body
        
        const allBody = {
            priceData:priceData,
            currentUserId:currentUserId,
            selectedPostId:selectedPostId,
        }
        deletefromdeclinedsifin(allBody)
        sendNotifyWhenOfferPrice(allBody)
        const selectedPost = await CarSchema.findOne({postId : selectedPostId})
        if(selectedPost){
           if(selectedPost.offeredPrices){
                const result = selectedPost.offeredPrices.find(object => String(object.userId) === String(currentUserId))
                if(!result){
                    const newData = {
                        price:Number(priceData.price),
                        userId:currentUserId,
                        date:new Date().toLocaleString(),
                    }
                    selectedPost.offeredPrices.push(newData)
                    await selectedPost.save()
                    res.status(200).json({selectedPost:selectedPost,result:newData})
                }else{
                    result.price = Number(priceData.price),
                    result.date = new Date().toLocaleString()
                    //finded.markModified('visits');
                    selectedPost.markModified('offeredPrices')
                    await selectedPost.save()
                    res.status(200).json({selectedPost:selectedPost,result:result})
                }
           }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



//get offerNotify



app.get('/:currentUserId/getOfferedNotifies',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allPostsList = await CarSchema.find()
        let allUsersList = await User.find()
        const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
        if(mynotifies){
            if(mynotifies.offersNotify){
                let newNotifyListDetail = []
                mynotifies.offersNotify.forEach(element => {
                    const result = allUsersList.find(object => String(object._id) === String(element.userId))
                    if(result){
                        const findpost = allPostsList.find(object => String(object.postId) === String(element.postId))
                        if(findpost){
                            const newData = {
                                postDetail:findpost,
                                userDetail:result,
                                notifyDetail:element,
                                message:`${result.email ?? result.name} Offered ${element.price} For Your Sale Post #_id/${element.postId}`
                            }
                            newNotifyListDetail.push(newData)
                        }
                    }
                });

                res.status(200).json({offersNotify:newNotifyListDetail})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

//send notify when delete

const findUserDetail =async (sendBody) => {
    const finduser = await User.findOne({_id : sendBody.currentUserId})
    if(finduser){
        const email = finduser.email ?? finduser.name
        return email
    }else{
        return 'No Info'
    }
}


const sendNotifyWhenDeclineOffer = async (sendBody) => {
    let allUsersList = await User.find()
    if(allUsersList.length > 0 ){
        const finduser = allUsersList.find(object => String(object._id) === String(sendBody.currentUserId))
        const myNotifySchema = await MyNotifySchema.findOne({userId : sendBody.selectedUserId})
        if(myNotifySchema){
            const result = myNotifySchema.declinedsNotify.find(object => String(object.postId) === String(sendBody.selectedPostId) && String(object.selectedUserId) === String(sendBody.selectedUserId))
            if(!result){
                const newData = {
                    notifyId:uuidv4(),
                    userId:sendBody.currentUserId,
                    date: new Date().toLocaleString(),
                    postId:sendBody.selectedPostId,
                    updated:false,
                    message: finduser.email + ' ' + 'Declined Your Offer',
                    selectedUserId:sendBody.selectedUserId,
                    price:sendBody.price
                }
                myNotifySchema.declinedsNotify.push(newData)
                await myNotifySchema.save()
            }else{
                result.date = new Date().toLocaleString(),
                result.updated = !result.updated
                result.message = finduser.email + ' ' + 'Declined Your Offer'
                result.price = sendBody.price
                myNotifySchema.markModified('declinedsNotify')
                await myNotifySchema.save()
            }
        }
    }
}


const deleteifinofferedprices = async (sendBody) => {
    const findpost = await CarSchema.findOne({postId : sendBody.selectedPostId})
    if(findpost){
        const result = findpost.offeredPrices.some(object => String(object.userId) === String(sendBody.selectedUserId))
        if(result){
            findpost.offeredPrices = findpost.offeredPrices.filter(object => String(object.userId) !== String(sendBody.selectedUserId))
            findpost.markModified('offeredPrices')
            await findpost.save()
        }
    }
}

//delete offer notifies

app.put('/:currentUserId/:selectedNotifyId/removeFromOfferNotifies',async(req,res)=>{
    const {currentUserId,selectedNotifyId} = req.params
    try{
        const mynotifies = await MyNotifySchema.findOne({userId : currentUserId})
        if(mynotifies){
            mynotifies.offersNotify = mynotifies.offersNotify.filter(object => String(object.notifyId) !== String(selectedNotifyId))
            const sendBody = {
                selectedNotifyId:selectedNotifyId,
                currentUserId:currentUserId,
                selectedPostId:req.body.allData.postDetail.postId,
                selectedUserId:req.body.allData.userDetail._id,
                price:req.body.allData.notifyDetail.price ?? 'No Info About Price',
            } 
            deleteifinofferedprices(sendBody)
            sendNotifyWhenDeclineOffer(sendBody)
            await mynotifies.save()
            res.status(200).json({mynotifies:mynotifies,removed:true})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

//change confirmed saler

//show offered prices


app.put('/:currentUserId/:selectedPostId/getOfferedPricesDetail',async(req,res)=>{
    const {currentUserId, selectedPostId} = req.params
    try{
        const offeredPrices = req.body.selectedPost.offeredPrices
        let allUsers = await User.find()
        if(allUsers.length > 0 ){
            let newList = []
            offeredPrices.forEach(element => {
                const result = allUsers.find(object => String(object._id) === String(element.userId))
                if(result){
                    const newData = {
                        selectedPostId:req.body.selectedPost.postId,
                        userDetail:result,
                        priceDetail:element,
                        confirmedPrice:String(result._id) === String(req.body.selectedPost.confirmedSaleUser) ? true : false
                    }
                    newList.push(newData)
                }
            });
            res.status(200).json({newList:newList.length > 0 ? newList : [{selectedPostId:'',userDetail:{},priceDetail:{},confirmedPrice:false,message:'Cant Found Price'}]})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/:selectedPostId/:selectedUserId/removeFromOfferedPrices',async(req,res)=>{
    const {currentUserId, selectedPostId, selectedUserId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        if(selectedpost){
            selectedpost.offeredPrices = selectedpost.offeredPrices.filter(object => String(object.userId) !== String(selectedUserId))
            const check = String(selectedpost.confirmedSaleUser) === String(selectedUserId) ? true : false
            if(check === true){
                selectedpost.confirmedSaleUser = ''
            }
            await selectedpost.save()
            res.status(200).json({selectedpost:selectedpost,removed:true})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


module.exports = app