const express = require('express');
const app = express.Router();

const MyCarSalePosts = require('./myCarSalePosts')
const CarSchema = require('./carSchema')

app.post('/:currentUserId/postCarSale',async (req,res)=>{
    const {currentUserId} = req.params
    try{
        const newCarPost = new CarSchema(req.body.carData)
        req.body.selectedImages.forEach(element => {
            newCarPost.carImages.push({imageId:element.id,image:element.image})
        });
        newCarPost.location = req.body.carDataLocation
        await newCarPost.save()
        res.status(200).json({newCarPost:newCarPost})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.post('/:currentUserId/addMyPosts', async (req, res) => {
    const { currentUserId } = req.params;
    try {
      const newCarPost = req.body.carData;
      newCarPost.carImages = []; // Initialize carImages as an empty array
      req.body.selectedImages.forEach(async (element) => {
        newCarPost.carImages.push({ imageId: element.id, image: element.image });
      });
      newCarPost.location = req.body.carDataLocation
      let mycarsaleposts = await MyCarSalePosts.findOne({ userId: currentUserId });
      if (!mycarsaleposts) {
        mycarsaleposts = new MyCarSalePosts({ userId: currentUserId, myCarSalePostsList: [newCarPost] });
      } else {
        mycarsaleposts.myCarSalePostsList.push(newCarPost);
      }
      await mycarsaleposts.save();
      res.status(200).json(mycarsaleposts);
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


app.get('/:selectedPostId/getSelectedPostDetail',async(req,res)=>{
  const {selectedPostId} = req.params
  try{
    const selectedpost = await CarSchema.findOne({postId : selectedPostId})
    res.status(200).json({selectedpost})
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})



module.exports = app