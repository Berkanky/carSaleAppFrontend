const express = require('express');
const app = express.Router();

const CarSchema = require('../carSale/carSchema')

app.put('/filterAllPosts', async (req, res) => {
    try {
      const filterBody = req.body;
      const allCarSalePosts = await CarSchema.find();
      const filteredList = allCarSalePosts.filter(object => {
        const location = filterBody.location;
        return Object.keys(filterBody).every(key => {
          if (key === 'location' && location) {
            const { city, country } = location;
            return (!city || object.location.city === city) && (!country || object.location.country === country);
          }
          return !filterBody[key] || object[key] === filterBody[key];
        });
      });
  
      if (filteredList.length > 0) {
        res.status(200).json({ filteredList, allCarSalePosts, filterBody });
      } else {
        res.status(200).json({ message: 'Not Found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }); 
  app.put('/:currentUserId/filterInCarsPage', async (req, res) => {
    const { currentUserId } = req.params;
    try {
      const filterBody = req.body;
      let allCarSalePosts = await CarSchema.find();
      let filteredList = allCarSalePosts;
  
      const filterData = req.body.filterData;
      filteredList = allCarSalePosts.filter(object => {
        return Object.keys(filterData).every(key => {
          return !filterData[key] || object[key] === filterData[key];
        });
      });
      if (allCarSalePosts.length > 0) {
        const kmMinMax = Object.values(filterBody.kilometresMinMax).length
        if (kmMinMax > 0) {
          const { minKm, maxKm } = filterBody.kilometresMinMax;
          if (minKm !== '' && minKm !== null) {
            filteredList = filteredList.filter(object => Number(object.kilometres) > Number(minKm));
          }
          if (maxKm !== '' && maxKm !== null) {
            filteredList = filteredList.filter(object => Number(object.kilometres) < Number(maxKm));
          }
        }
        const priceMinMaxVal = Object.values(filterBody.priceMinMax).length
        if (priceMinMaxVal > 0) {
          const { minPrice, maxPrice } = filterBody.priceMinMax;
          if (minPrice !== '' && minPrice !== null) {
            filteredList = filteredList.filter(object => Number(object.price) > Number(minPrice));
          }
          if (maxPrice !== '' && maxPrice !== null) {
            filteredList = filteredList.filter(object => Number(object.price) < Number(maxPrice));
          }
        }
  
        const location = filterBody.location;
        const locVal = Object.values(filterBody.location).length
        if (locVal > 0) {
          const { city, country } = location;
          filteredList = filteredList.filter(object => {
            return (!city || object.location.city === city) && (!country || object.location.country === country);
          });
        }
  
        if (filteredList.length > 0) {
          res.status(200).json({ filteredList, allCarSalePosts, filterBody });
        } else {
          res.status(200).json({ message: 'Not Found' });
        }
      } else {
        res.status(200).json({ message: 'No car sale posts found' });
      }
      //res.status(200).json({filteredList,filterData,filterBody})
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
/* app.put('/:currentUserId/filterInCarsPage',async(req,res)=>{
  const {currentUserId} = req.params
  try{
    let allcarsaleposts = await CarSchema.find()
    if(allcarsaleposts.length > 0){
      const filterData = req.body
      if(filterData.kilometresMinMax){
        if(filterData.kilometresMinMax.minKm != '' && filterData.kilometresMinMax.minKm != null){
          allcarsaleposts = allcarsaleposts.filter(object => Number(object.kilometres) > Number(filterData.kilometresMinMax.minKm))
        }else if(filterData.kilometresMinMax.maxKm != '' && filterData.kilometresMinMax.maxKm != null){
          allcarsaleposts = allcarsaleposts.filter(object => Number(object.kilometres) < Number(filterData.kilometresMinMax.maxKm))
        }
        
      }
      if(filterData.priceMinMax){
        if(filterData.priceMinMax.minPrice != '' && filterData.priceMinMax.minPrice != null){
          allcarsaleposts = allcarsaleposts.filter(object => Number(object.price) > Number(filterData.priceMinMax.minPrice))
        }else if(filterData.priceMinMax.maxPrice != '' && filterData.priceMinMax.maxPrice != null){
          allcarsaleposts = allcarsaleposts.filter(object => Number(object.price) < Number(filterData.priceMinMax.maxPrice))
        }
      }
    }
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})
 */






module.exports = app