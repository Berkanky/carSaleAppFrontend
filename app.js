const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer')
//userschema 
const User = require('./userSchema/userSchema')


// Create a new Express app
const app = express();

// Connect to MongoDB
const uri = 'mongodb://localhost:27017/carapp';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Create a new Mongoose model

/* 
const imageObjSchema = new mongoose.Schema({
  image:{
    type:String,
    required:false
  },
  imageId:{
    type:String,
    required:false
  },
  inDb:{
    type:Boolean,
    required:false
  }
})


const User = mongoose.model('User', {
  email:{
    type:String,
    required:false
  },
  firebaseUserId:{
    type:String,
    required:false
  },
  phoneNumber:{
    type:String,
    required:false
  },
  name: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  age:{
    type:String,
    required:false
  },
  authType:{
    type:String,
    required:false
  },
  job:{
    type:String,
    required:false
  },
  userImage:{
    type:String,
    required:false
  },
  password:{
    type:String,
    required:false
  },
  userImages:[imageObjSchema],
  date: {
    type: Date,
    default: Date.now,
    required: false,
  },
  online:{
    type:Boolean,
    required:false,
  }
}); */


//http://localhost:8080
app.use(cors({
  origin:'*',
})); 
app.use(express.json({ limit: '50000mb' }));
app.use(express.urlencoded({ limit: '50000mb', extended: true,parameterLimit:50000 }));  
//lastSearchCrud
const lastSearchCrud = require('./lastSearch/lastSearchCrud')

//profileOptions.js
const profileOptions = require('./profileOptions')
//carSale
const carCrud = require('./carSale/carCrud')

//mycaresalepostsCrud
const mycaresalepostsCrud = require('./mycarsaleposts/mycarsalepostsCrud')

//filterdatacrud
const filterDataCrud = require('./filterData/filterDataCrud')

//my saved car posts
const mySavedCarSalePost = require('./mySavedCarSalePosts/crud')

//messagesSChema
const messageCrud = require('./messages/crud')


//selectedUserDetail
const selectedUserDetailCrud = require('./selectedUserDetail/crud')


//shared post schema

const sharepostcrud = require('./shareds/crud')


//visit schema
const MyVisitsSchema = require('./visit/crud')


//follwo list crud

const followListCrud = require('./followList/crud')

//notifies crud

const MyNotifyCrud = require('./notify/crud')

//offer crud

const offerCrud = require('./offer/crud')


//confirmeds crud

const confirmedsCrud = require('./confirmeds/crud')

//declined offers

const declinedoffers = require('./declinedsNotify/crud')


app.use(
  '/carapp', 
  profileOptions,carCrud,mycaresalepostsCrud,filterDataCrud,lastSearchCrud,mySavedCarSalePost,
  messageCrud,selectedUserDetailCrud,sharepostcrud,MyVisitsSchema,
  followListCrud,MyNotifyCrud,offerCrud,confirmedsCrud,declinedoffers
);






//current date

const getToday = () => {
  const today = new Date();

  return today.toISOString();
};


//get users
app.get('/carapp/users',async (req,res)=>{
  try{
    let users = await User.find()
    res.status(200).json({message:'Done'})
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})


//when login with google

app.post('/carapp/users/:currentUserFirebaseId/addToDb', async (req, res) => {
  const { currentUserId } = req.params;
  try {
    if(req.body.email){
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json(newUser);
      } else {
        user.online = true;
        await user.save();
        res.status(200).json(user);
      }
    }else if(req.body.phoneNumber && !req.body.email){
      const user = await User.findOne({ phoneNumber: req.body.phoneNumber });
      if (!user) {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(200).json(newUser);
      } else {
        user.online = true;
        await user.save();
        res.status(200).json(user);
      }
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//change online
app.put('/carapp/users/:currentUserId/changeOnline',async(req,res)=>{
  const {currentUserId} = req.params
  try{
    const myacc = await User.findOne({firebaseUserId : currentUserId})
    if(myacc){
      myacc.online =! myacc.online
      await myacc.save()
      res.status(200).json(myacc)
    }
  }catch(err){
    res.status(500).json(err)
  }
})

//getmyacc

app.get('/carapp/:selectedUserId/getSelectedUserDetail',async(req,res)=>{
  const {selectedUserId} = req.params
  try{
    const findeduser = await User.findById(selectedUserId)
    if(findeduser){
      res.status(200).json({findeduser})
    }
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})

app.get('/carapp/users/:currentUserId',async (req,res)=>{
  const {currentUserId} = req.params
  try{
    const myacc = await User.findOne({firebaseUserId : currentUserId})
    if(myacc){
      res.status(200).json(myacc)
    }
  }catch(err){
    res.status(500).json(err)
  }
})


//nodemailer email link

app.post('/carapp/emailLink',async (req,res)=>{
  //const {currentUserId} = req.params
  try{
   // const clickHereMessage = '<a href="http://localhost:8080/#/login">Click Here</a>';
    const myacc = await User.findOne({email : req.body.email})
    if(!myacc){
      const codeForLogin = uuidv4()
      const emailTemplate = `
      Hi,
      
      You have requested to login to our application. Click on the link below to login:
      
      ${codeForLogin} Your Code Please Enter This Code.
      
      Thanks,
      The Team  ${getToday()}
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
      to: req.body.email, // List of recipients
      subject: 'Authentication', // Subject line
      text: emailTemplate, // Plain text body
      };
      
      transport.sendMail(mailOptions, function(err, info) {
          if (err) {
            console.log(err)
          } else {
            console.log(info);
            res.status(200).json({alreadyIn:false,mailOptions:mailOptions,currentCode:codeForLogin})
          }
      });
    }else if(myacc){
      res.status(200).json({alreadyIn:true,message:'It looks like you have already signed up. Would you like to log in?',myacc:myacc})
    }
  }catch(err){
    res.status(500).json({message:'Internal Server Error'})
  }
})


const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
