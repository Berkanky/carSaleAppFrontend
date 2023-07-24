const express = require('express');
const app = express.Router();
const MyMessageSchema = require('./schema')
const User = require('../userSchema/userSchema')
const nodemailer = require('nodemailer');
const MySavedCarSalePost = require('../mySavedCarSalePosts/schema');
const CarSchema = require('../carSale/carSchema');
const MyCarSalePosts = require('../carSale/myCarSalePosts');
const MyNotifySchema = require('../notify/schema')



const sendEmail = (allBody) =>{
    const emailTemplate = `
    Dear ${allBody.selectedUserDetail.email ?? ''},
    
    You have message from ${allBody.senderUserDetail.email ?? ''};
    
    ${allBody.messageData.message}
    
    Thanks,
    AutoTrader
    `
    const myemail = 'yusufbk92@gmail.com'
    const mypass  = 'otmsflxkznxnbdln'
    let transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: myemail,
        pass: mypass
      }
   });
   const mailOptions = {
    from: myemail, // Sender address
    to: allBody.selectedUserDetail.email, // List of recipients
    subject: 'Message', // Subject line
    text: emailTemplate, // Plain text body
    };
    
    transport.sendMail(mailOptions, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
          res.status(200).json({emailTemplate,mailOptions})
        }
    });
}

app.post('/:currentUserId/:selectedUserId/sendMessage',async(req,res)=>{
    const {currentUserId,selectedUserId} = req.params
    try{
        const selecteduser = await User.findOne({_id : selectedUserId})
        const messageData = req.body.messagePost
        const allBody = {
            messageData:req.body.messagePost,
            senderUserDetail:req.body.senderUserDetail,
            selectedUserDetail:selecteduser
        }
        sendEmail(allBody)
        const mymessaageschema = await MyMessageSchema.findOneAndUpdate(
            {userId : currentUserId},
            {$push : {messages : messageData}},
            {new:true,upsert:true}
        )
        const selecteduserschema = await MyMessageSchema.findOneAndUpdate(
            {userId : selectedUserId},
            {$push : {messages:messageData}},
            {new:true,upsert:true}
        )
        res.status(200).json({selecteduserschema,mymessaageschema,messageData,selecteduser,allBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.get('/:currentUserId/:selectedUserId/getMessages',async(req,res)=>{
    const {currentUserId,selectedUserId} = req.params
    try{
        const mymessaageschema = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessaageschema){
            if(mymessaageschema.messages && mymessaageschema.messages.length > 0){
                let list = mymessaageschema.messages.filter(object => String(object.selectedUserId) === String(selectedUserId))
                if(list.length > 0){
                    res.status(200).json({list})
                }
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

// get sended mails and income mails from userDetail plugin

app.post('/:currentUserId/:selectedUserId/sendOnlyEmail',async(req,res)=>{
    const {currentUserId,selectedUserId} = req.params
    try{
        const selecteduserdetail = await User.findById(selectedUserId)
        if(selecteduserdetail){
            const allBody = {
                messageData:req.body.messagePost,
                senderUserDetail:req.body.senderUserDetail,
                selectedUserDetail:selecteduserdetail
            }
            sendEmail(allBody)
        }
        const selecteduser = await MyMessageSchema.findOneAndUpdate(
            {userId : selectedUserId},
            {$push : {mails : req.body.messagePost}},
            {new:true,upsert:true}
        )
        const mymail = await MyMessageSchema.findOneAndUpdate(
            {userId : currentUserId},
            {$push : {mails : req.body.messagePost}},
            {new:true,upsert:true}
        )
        res.status(200).json({mymail,selecteduser})
    }catch(err){
        res.status(500).json({message:'Internal  Server Error'})
    }
})


app.get('/:currentUserId/getOnlyMails',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allUsers = await User.find()
        let mymail = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymail){
            let mymaillist = []
            mymail.mails.forEach(element => {
                const senderResult = allUsers.find(object => String(object._id) === String(element.senderId))
                const result = allUsers.find(object => String(object._id) === String(element.selectedUserId))
                if(result && senderResult){
                    mymaillist.push({userDetail:result,mailDetail:element,senderDetail:senderResult})
                }
            });
            res.status(200).json({mymaillist})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



//get all messages for each post sended messages with for posts
app.get('/:currentUserId/getMyMails',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let allUsers = await User.find()
        let carsList = await CarSchema.find()
        const mymessage = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessage){
            let messageList = []
            mymessage.messages.forEach(element => {
                if(element.postId !== '' && element.postId !== null){
                    const result = messageList.some(object => String(object.postId) === String(element.postId))
                    if(!result){
                        messageList.push({postId:element.postId,messages:[],postDetail:{}})
                    }
                }
            });
            mymessage.messages.forEach(element => {
                if(element.postId !== '' && element.postId !== null){
                    const result = messageList.find(object => String(object.postId) === String(element.postId))
                    if(result){
                        result.messages.push(element)
                    }
                }
            });
            messageList.forEach(async (element) => {
                if(element.postId !== '' && element.postId !== null){
                    const result = carsList.find(object => String(object.postId) === String(element.postId))
                    if(result){
                        element.postDetail = result
                    }
                }
            });
            res.status(200).json({messageList})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.post('/:currentUserId/:selectedPostId/getSelecetdMailDetail',async(req,res)=>{
    const {currentUserId,selectedPostId} = req.params
    try{
        let allUsers = await User.find()
        const selectedDetail = req.body.selectedDetail
        let uniqueUsers = []
        selectedDetail.messages.forEach(message => {
            const result = uniqueUsers.find(object => String(object.userDetail._id) === String(message.senderId))
            if(result){
                const finduser = allUsers.find(object => String(object._id) === String(message.senderId))
                if(finduser){
                    result.messages.push(message)
                }
            }else{
                const finduser = allUsers.find(object => String(object._id) === String(message.senderId))
                if(finduser){
                    uniqueUsers.push({userDetail:finduser,messages:[message]})
                }
            }
        })
        res.status(200).json({uniqueUsers,selectedDetail}) 
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:currentUserId/removeSelectedMessage',async(req,res)=>{
    const {currentUserId,selectedPostId,selectedMessageId} = req.params
    try{
        let addedList = req.body
        const mymessaageschema = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessaageschema){
            addedList.forEach((element) => {
                mymessaageschema.messages = mymessaageschema.messages.filter(object => String(object._id) !== String(element._id))
            });
            await mymessaageschema.save()
            res.status(200).json({mymessaageschema})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

//send notify when confirmed selected post offered user 


const sendNotifyWhenConfirm = async (newObject) => {
    const selectedusernotify = await MyNotifySchema.findOne({userId : newObject.selectedUserId})
    if(selectedusernotify){
        const result = selectedusernotify.postNotify.find(object => String(object.postId) === String(newObject.selectedPostId))
        if(!result){
            selectedusernotify.postNotify.push({postId:newObject.selectedPostId,date:new Date().toLocaleString(),userId:newObject.currentUserId, price:newObject.notifyDetail.price ?? 0})
            await selectedusernotify.save()
        }else{
            //selectedPost.markModified('offeredPrices')
            result.date = new Date().toLocaleString()
            result.price = newObject.notifyDetail.price ?? 0
            result.userId = newObject.currentUserId
            selectedusernotify.markModified('postNotify')
            await selectedusernotify.save()
        }
    }else{
        const selectedusernotify = await MyNotifySchema.findOneAndUpdate(
            {userId : newObject.selectedUserId},
            {$push : {postNotify : {postId:newObject.selectedPostId,date:new Date().toLocaleString(),userId:newObject.currentUserId,price:newObject.notifyDetail.price ?? 0}}},
            {new:true,upsert:true}
        )
    }
}

const updatemycarsales =async (allBody) => {
    if(allBody.mycarschema.myCarSalePostsList && allBody.selectedCarSchema){
        const result = allBody.mycarschema.myCarSalePostsList.find(object => String(object.postId) === String(allBody.selectedPostId))
        if(result){
            result.confirmedSaleUser = allBody.selectedCarSchema.confirmedSaleUser
            //allBody.myCarSalePosts.markModified('myCarSalePostsList')
            allBody.mycarschema.markModified('myCarSalePostsList')
            await allBody.mycarschema.save()
        }
    }
}

//add offered prices if deleted when confirmed

const addOfferedPricesAgain =async (newObject) => {
    const findpost = await CarSchema.findOne({postId : newObject.selectedPostId})
    if(findpost){
        const result = findpost.offeredPrices.find(object => String(object.userId) === String(newObject.selectedUserId))
        if(!result){
            findpost.offeredPrices.push({price:newObject.notifyDetail.price ?? 0,userId:newObject.selectedUserId,date:newObject.notifyDetail.date})
            await findpost.save()
        }
    }
}




//confirm saler

app.put('/:currentUserId/:selectedUserId/:selectedPostId/addConfirmSaler',async(req,res)=>{
    const {currentUserId,selectedUserId,selectedPostId} = req.params
    try{
        let mycarschema = await MyCarSalePosts.findOne({userId : currentUserId})
        const notifyDetail = req.body.notifyDetail
        const allData = req.body.allData
        const newObject = {
            currentUserId:currentUserId,
            selectedUserId:selectedUserId,
            selectedPostId:selectedPostId,
            notifyDetail:notifyDetail
        }
        const selectedCarSchema = await CarSchema.findOne({postId : selectedPostId})
        const selectedUser = await User.findOne({_id : selectedUserId})
        if(selectedCarSchema && mycarschema.myCarSalePostsList){
            if(selectedCarSchema.confirmedSaleUser !== '' && selectedCarSchema.confirmedSaleUser !== null && String(selectedCarSchema.confirmedSaleUser) === String(allData.userDetail._id)){
                selectedCarSchema.confirmedSaleUser = ''
                await selectedCarSchema.save()
                const allBody = {
                    selectedCarSchema,mycarschema,selectedPostId
                }
                updatemycarsales(allBody)
            }
            else{
                selectedCarSchema.confirmedSaleUser = selectedUser._id
                sendNotifyWhenConfirm(newObject)
                addOfferedPricesAgain(newObject)
                await selectedCarSchema.save()
                const allBody = {
                    selectedCarSchema,mycarschema,selectedPostId
                }
                updatemycarsales(allBody)
            }
        }


/*         const checkselectedpost = await CarSchema.findOne({userId : selectedPostId})
        const mycarschema = await MyCarSalePosts.findOne({userId : currentUserId})
        const allBody = {
            checkselectedpost,mycarschema
        }
        updatemycarsales(allBody) */
        const mySavedCarSalePost = await MySavedCarSalePost.findOne({userId : currentUserId})
        if(mySavedCarSalePost){
            if(mySavedCarSalePost.mySavedCarSalePostsList){
                const result = mySavedCarSalePost.mySavedCarSalePostsList.find(object => String(object.postId) === String(selectedPostId))
                if(result){
                    if(result.confirmedSaleUser !== '' && result.confirmedSaleUser !== null){
                        const result = await MySavedCarSalePost.findOneAndUpdate(
                            { userId: currentUserId, 'mySavedCarSalePostsList.postId': selectedPostId },
                            { $set: { 'mySavedCarSalePostsList.$.confirmedSaleUser':  '' } },
                            { new: true }
                          );
                    }else{
                        const result = await MySavedCarSalePost.findOneAndUpdate(
                            { userId: currentUserId, 'mySavedCarSalePostsList.postId': selectedPostId },
                            { $set: { 'mySavedCarSalePostsList.$.confirmedSaleUser':  selectedUser._id } },
                            { new: true }
                          );
                    }
                }
            }
        }


        res.status(200).json({selectedCarSchema,selectedUser,mycarschema,mySavedCarSalePost})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})





//confirmed saler details

app.get('/:currentUserId/:selectedPostId/getConfirmedSalerDetail',async(req,res)=>{
    const {currentUserId,selectedPostId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        if(selectedpost){
            if(selectedpost.confirmedSaleUser != '' && selectedpost.confirmedSaleUser != null){
                const confirmedsaleuserdetail = await User.findById(selectedpost.confirmedSaleUser)
                if(confirmedsaleuserdetail){
                    res.status(200).json({confirmedsaleuserdetail})
                }
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


//delete only mails

app.put('/:currentUserId/removeOnlyMailsList',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let addedOnlyMailList = req.body
        const mymessaageschema = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessaageschema){
            addedOnlyMailList.forEach(element => {
                mymessaageschema.mails = mymessaageschema.mails.filter(object => String(object._id) !== String(element.mailDetail._id))
            });
            await mymessaageschema.save()
            res.status(200).json({mymessaageschema})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

//download file

app.get('/:currentUserId/:selectedMailId/:selectedFileId/downloadFileUrl',async(req,res)=>{
    const {currentUserId, selectedMailId, selectedFileId} = req.params
    try{
        const mymessaageschema = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessaageschema){
            const currentmail = mymessaageschema.mails.find(object => String(object._id) === String(selectedMailId))
            if(currentmail){
                const selectedfile =  currentmail.file.find(object => String(object._id) === String(selectedFileId))
                if(selectedfile){
                    res.status(200).json({selectedfile})
                }
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})
//show only sended mails
app.put('/:currentUserId/showOnlyMySendeds',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let messageList = req.body.messages
        let mailList = req.body.myOnlyMails
        const mymessaageschema = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessaageschema){
            let filterMails = mymessaageschema.mails.filter(object => String(object.senderId) === String(currentUserId))
            let filterMessages = mymessaageschema.messages.filter(object => String(object.senderId) === String(currentUserId))
            mailList.forEach(element => {
                const result = filterMails.find(object => String(object._id) === String(element.mailDetail._id))
                if(!result){
                    mailList = mailList.filter(object => String(object.mailDetail._id) !== String(element.mailDetail._id))
                }
            });
            res.status(200).json({filterMails:mailList,filterMessages})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/findEmailWithInputVal',async(req,res)=>{
    const {currentUserId} = req.params
    try{
        let userList = await User.find()
        const mymessaageschema = await MyMessageSchema.findOne({userId : currentUserId})
        if(mymessaageschema){
            const searchval = req.body.searchValue
            let postedMailList = req.body.mailList
            let mailList = mymessaageschema.mails
            mailList.forEach(element => {
                const result = userList.find(object => String(object._id) === String(element.senderId))
                if(result){
                    element.userDetail = result
                }
            });
            let results = mailList.filter(object => {
                const emailMatch = object.userDetail.email.toLowerCase().includes(searchval.toLowerCase());
                const subjectMatch = object.subject.toLowerCase().includes(searchval.toLowerCase());
                const messageMatch = object.message.toLowerCase().includes(searchval.toLowerCase());
              
                return emailMatch || subjectMatch || messageMatch;
              });
              
              if (results.length > 0) {
                postedMailList.forEach(element => {
                    const result = results.find(object => String(object._id) === String(element.mailDetail._id))
                    if(!result){
                        postedMailList = postedMailList.filter(object => String(object.mailDetail._id) !== String(element.mailDetail._id))
                    }
                });
                res.status(200).json({ mailList, userList, results, postedMailList });
              } else {
                res.status(200).json({ message: 'No matching results found.' });
              }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})
//create new email manuel

app.post('/getAllUsersForSendEmailDialog',async(req,res)=>{
    try{
        let allUserList = await User.find()
        allUserList.forEach(element => {
            if(element.email != '' && element.email != null){

            }else{
                allUserList = allUserList.filter(object => object._id !== element._id)
            }
        });
        if(allUserList.length > 0){
            const emailVal = req.body.email
            
            let results = allUserList.filter(object=> {
                const emailWatch = object.email.toLowerCase().includes(emailVal.toLowerCase())
                return emailWatch
            })
            if(results.length > 0){
                res.status(200).json({results})
            }else{
                res.status(200).json({results:[]})
            }
            
            //res.status(200).json({allUserList})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

module.exports = app