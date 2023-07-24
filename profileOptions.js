const express = require('express');
const app = express.Router();


const User = require('./userSchema/userSchema')

//clear Image

app.put('/:currentUserId/removeProfilePic',async (req,res)=>{
    const {currentUserId} = req.params
    try{
        const myacc = await User.findById(currentUserId)
        if(myacc){
            myacc.userImage = req.body.image ?? ''
            await myacc.save()
            res.status(200).json({myacc:myacc})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.post('/:currentUserId/addImages', async (req, res) => {
    const { currentUserId } = req.params;
    try {
      const myacc = await User.findById(currentUserId);
      if (myacc) {
        const images = req.body[0]
        images.forEach(element => {
            myacc.userImages.push(element)
        });
        await myacc.save()
        res.status(200).json(myacc)
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

app.delete('/:currentUserId/:selectedImageId/removeFromUserImages',async (req,res)=>{
    const {currentUserId,selectedImageId} = req.params
    try{
        const myacc = await User.findById(currentUserId)
        myacc.userImages = myacc.userImages.filter(object => String(object._id) !== String(selectedImageId))
        await myacc.save()
        res.status(200).json(myacc)
    }catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.put('/:currentUserId/updateLocation',async (req,res)=>{
    const {currentUserId} = req.params
    try{
        const myacc = await User.findById(currentUserId)
        myacc.locationDetails = req.body
        await myacc.save()
        res.status(200).json({myacc:myacc})
    }catch (err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.delete('/:currentUserId/removeLocation',async (req,res)=>{
    const {currentUserId} = req.params
    try{
        const myacc = await User.findById(currentUserId)
        myacc.locationDetails = undefined
        await myacc.save()
        res.status(200).json({myacc:myacc})
    }catch (err){
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

app.put('/:currentUserId/updateCurrentUser',async (req,res)=>{
    const {currentUserId} = req.params
    try{
        const myacc = await User.findOneAndUpdate(
            {_id : currentUserId},
            {$set : req.body},
            {new:true}
        )
        res.status(200).json(myacc)
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


module.exports = app;