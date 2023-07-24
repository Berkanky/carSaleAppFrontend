const express = require('express');
const app = express.Router();

const MyCarSalePosts = require('../carSale/myCarSalePosts')
const CarSchema = require('../carSale/carSchema')

app.get('/:currentUserId/getMyCarSalePost',async(req,res)=>{
    const {currentUserId} = req.params
    try{
      let allCarSalePosts = await CarSchema.find()
      if(allCarSalePosts.length > 0 ){
        const mycaresalepost = await MyCarSalePosts.findOne({userId : currentUserId})
        if(mycaresalepost){
          let newList = []
          mycaresalepost.myCarSalePostsList.forEach(element => {
            const result = allCarSalePosts.find(object => String(object.postId) === String(element.postId))
            if(result){
              newList.push(result)
            }
          });
          res.status(200).json({newList})
        }
      }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.put('/:currentUserId/:selectedPostId/removeMyCarSalePost', async (req, res) => {
    const { currentUserId, selectedPostId } = req.params;
    try {
      let removedPost = await CarSchema.findOneAndDelete({ postId: selectedPostId });
      const mycarSalePosts = await MyCarSalePosts.findOne({ userId: currentUserId });
      if (removedPost && mycarSalePosts.myCarSalePostsList) {
        mycarSalePosts.myCarSalePostsList = mycarSalePosts.myCarSalePostsList.filter(
          (object) => String(object.postId) !== String(selectedPostId)
        );
        await mycarSalePosts.save();
        res.status(200).json({ mycarSalePosts: mycarSalePosts, removedPost: removedPost });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

 //remove image from carImages
  app.put('/:selectedPostId/:selectedImageId/removeImage',async(req,res)=>{
    const {selectedPostId,selectedImageId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        selectedpost.carImages = selectedpost.carImages.filter(object => String(object._id) !== String(selectedImageId))
        await selectedpost.save()
        res.status(200).json({selectedpost})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
  })

  //remove main image

  app.put('/:selectedPostId/removeMainImage',async(req,res)=>{
    const {selectedPostId} = req.params
    try{
        const selectedpost = await CarSchema.findOne({postId : selectedPostId})
        selectedpost.mainImage = ''
        await selectedpost.save()
        res.status(200).json({selectedpost})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
  })

//update post entire

app.put('/:selectedPostId/updatePost', async (req, res) => {
    const { selectedPostId } = req.params;
    try {
      let selectedPost = await CarSchema.findOne({ postId: selectedPostId });
      if (!selectedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const updatedPost = req.body.carData;
      updatedPost.location = req.body.location ?? selectedPost.location;
  
      let newImageList = selectedPost.carImages.concat(req.body.selectedImages);
  
      selectedPost = Object.assign(selectedPost, updatedPost);
      selectedPost.carImages = newImageList;
  
      await selectedPost.save();
  
      res.status(200).json({ selectedPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
//update post in my posts
app.put('/:currentUserId/:selectedPostId/updateInMyPosts', async (req, res) => {
    const { currentUserId, selectedPostId } = req.params;
    try {
      const selectedpost = await CarSchema.findOne({ postId: selectedPostId });
      let myposts = await MyCarSalePosts.findOne({ userId: currentUserId });
      let findPostIndex = myposts.myCarSalePostsList.findIndex(object => String(object.postId) === String(selectedPostId));
      if (findPostIndex !== -1) {
        myposts.myCarSalePostsList[findPostIndex] = selectedpost;
        await myposts.save();
        res.status(200).json({ myposts });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  app.get('/:currentUserId/getAllCarSalePosts',async(req,res)=>{
    const {currentUserId} = req.params
    try{    
        let allCarSalePosts = await CarSchema.find()
        if(allCarSalePosts.length > 0 ){
            res.status(200).json({allCarSalePosts})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
  })
  
  

  /* 
  
  app.put('/:currentUserId/:selectedPostId/removeImage',async(req,res)=>{
    try{
        
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
  })
  
  */







module.exports = app