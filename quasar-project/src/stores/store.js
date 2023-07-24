import { defineStore } from 'pinia';
import axios from 'axios'
export const useCounterStore = defineStore('counter', {
  state: () => ({
    firebaseInfoUser:{},
    userDetail:{},
    pexelId:'563492ad6f917000010000018990b39d61f845559dab3acb2c9dd16d',
    window:{},
    newHeight:'',
    mobileActive:false,
    baseUrl:'http://localhost:3000',


    //login comp active
    loginCompActive:false,

    //catchesUserInLogin myacc
    myAcc:{},
    //
    selectedProfileOption:{id:1,label:'My Profile',icon:'person',color:'primary',value:'profile'},
    profileListsCompActive:true,

    //profile settings
    profileImageCompActive:false,

    //map selected location informations
    carDataLocation:{},



    //filterdatas
    brandList:[],
    modelList:[],
    colorCompActive:false,
    driveTrainOptions:[
      "four-wheel drive",
      "all-wheel drive (AWD)",
      "front-wheel drive (FWD)",
      "rear-wheel drive (RWD)",
      "other"
    ],
    doorOptions:[
      2,3,4,5
    ],
    engineSizeOptions:[
      500,
      1000,
      1500,
      2000,
      2500,
      3000,3500,4000,4500,5000,5500,6000
    ],
    cylindersOptions:[
      3,
      4,
      5,
      6,
      7,
      8
    ],
    colorOptions:[
      "black",
      "grey",
      "beige",
      "brown",
      "red",
      "green","blue","purple","white","orange","silver","yellow","other"
    ],
    sellerTypeOptions:[
      "dealer",
      "privateSeller"
    ],
    bodyOption:[
      "hatchback",
      "sedan",
      "suv",
      "coupe",
      "crossover",
      "convertible"
    ],
    conditionOption:[
      "used",
      "new"
    ],
    transmissionOption:[
      "manual",
      "automatic"
    ],
    fuelTypeOption:[
      "oil",
      "diesel",
      "hybrid",
      "electric"
    ],
    filterData:{},
    locationFilterData:{},

    //all car sale posts
    allCarSalePosts:[],

    //map comp
    mapCompActive:false,

    //homepage  phoot
    homePagePhotoUrl:'',

    //cars page filterData
    carsPageFilterData:{},
    priceMinMax:{},
    kilometresMinMax:{},


    //cars page result datas
    filteredList:[],
    filterBody:{},

    //mysaved posts
    mySavedPostsList:[],

    //images acitve
    imagesCompActive:false,

    //messageList

    messages:[],
    uniqueUsers:[],
    mailPageChatCompActive:false,
    selectedUniqueUser:{},
    selectedUniqueUserDetail:{},
    answerDialogActive:false,

    //profileDetailplugin
    selecteUserProfileCompActive:false,
    selecteUserProfile:{},
    onlyMailDetailDialogActive:false,
    myAllFolLists:{},

    //Create  Email
    createEmailDialogActive:false,

    //shareds
    sharedsDialogActive:false,
    mySendedList:[],
    myReceivedList:[],
    allSharedList:[],
    myAllVisits:[],

    //history

    showHistoryDialogActive:false,
    myAllVisitsListWithDetail:[],

    //show viewers
    showViewersDialogActive:false,
    selectedPostVisiters:[],

    //myfollowsactive
    myFollowsDialogActive:false,
    detailedFolList:{},
    //notify

    notifyDialogActive:false,
    followsNotify:[],
    postNotify:[],
    declinedsNotify:[],
    //offer price dialog
    offerPriceCompActive:false,

    //myall confirmeds
    allConfirmedCarSalePosts:[],


    //my sale posts confirmed detail dialog
    confirmedSaleUserDialogActive:false,
    confirmedSaleUserDetail:{},


    //offerslist
    offersListDialogActive:false,
    forOfferedListSelectedSalePost:{}
  }),
  getters:{
  },
  actions:{



    getMyConfirmedPosts(id){
      axios.get(`${this.baseUrl}/carapp/${id}/getAllConfirmeds`)
        .then(res=>{
          console.log(res)
          this.allConfirmedCarSalePosts = res.data.allConfirmedCarSalePosts
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyNotifies(id){
      axios.get(`${this.baseUrl}/carapp/${id}/getMyNotifies`)
        .then(res=>{
          console.log(res)
          this.followsNotify = res.data.notifyAllBody.followsNotify
          this.postNotify = res.data.notifyAllBody.postNotify
          this.declinedsNotify = res.data.notifyAllBody.declinedsNotify
          console.log('postNotify',this.postNotify)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyFolListsDetail(id){
      axios.get(`${this.baseUrl}/carapp/${id}/getMyFollsDetails`)
        .then(res=>{
          console.log(res)
          this.detailedFolList = res.data.allResultData
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyFolLists(id){
      console.log('id',id)
      axios.get(`${this.baseUrl}/carapp/${id}/getMyfolls`)
        .then(res=>{
          console.log(res)
          this.myAllFolLists = res.data.myfollowlist
          console.log('myAllFolLists',this.myAllFolLists)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyAllVisitsWithDetails(){
      axios.get(`${this.baseUrl}/carapp/${this.userDetail._id}/getMyAllVisitsWithDetail`)
        .then(res=>{
          console.log(res)
          this.myAllVisitsListWithDetail = res.data.visitsList
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyAllVisits(){
      axios.get(`${this.baseUrl}/carapp/${this.userDetail._id}/getMyAllVisits`)
        .then(res=>{
          console.log(res)
          this.myAllVisits = res.data.allVisits
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyShareds(id){
      axios.get(`${this.baseUrl}/carapp/${id}/getMyShareds`)
        .then(res=>{
          console.log(res)
          this.mySendedList = res.data.mySendedList
          this.myReceivedList = res.data.myReceivedList
          this.allSharedList = res.data.allSharedList
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyMails(){
      axios.get(`${this.baseUrl}/carapp/${this.userDetail._id}/getMyMails`)
        .then(res=>{
          console.log('getMyMails',res)
          this.messages = res.data.messageList
          //this.uniqueUsers = res.data.uniqueUsers
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMySavedPosts(){
      axios.get(`${this.baseUrl}/carapp/${this.userDetail._id}/getMySavedPostsList`)
        .then(res=>{
          console.log(res)
          //this.mySavedPostsList = res.data.mySavedCarSalePost.mySavedCarSalePostsList
          this.mySavedPostsList = res.data.mySavedList
          console.log('mySavedPostsList',this.mySavedPostsList)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getRandomPhoto(){
      const API_KEY = this.pexelId
      const query = 'car'
      const url = `https://api.pexels.com/v1/search?query=${query}`;
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the data from the API response
          const maxNumber = data.photos.length
          const randomNumber = Math.floor(Math.random() * maxNumber);
          console.log(data)
          const photoUrl = data.photos[randomNumber].src.large;
          console.log(photoUrl);
          if(photoUrl){
            this.homePagePhotoUrl = photoUrl
          }else{
            console.log('non photo')
          }
        })
        .catch((error) => {
          // Handle any errors that occur
          console.error(error);
        });
    },
    getAllPosts(){
      axios.get(`${this.baseUrl}/carapp/${this.userDetail._id}/getAllCarSalePosts`)
        .then(res=>{
          console.log('allcarsalepostsres',res)
          this.allCarSalePosts = res.data.allCarSalePosts
          console.log('allcarsaleposts',this.allCarSalePosts)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkImageOrNot(){
      if(this.userDetail.userImage){
        return true
      }else if(!this.userDetail.userImage && this.firebaseInfoUser.photoURL){
        return true
      }else{
        return false
      }
    },
    checkImage(){
      if(this.userDetail.userImage){
        return this.userDetail.userImage
      }else if(!this.userDetail.userImage && this.firebaseInfoUser.photoURL){
        return this.firebaseInfoUser.photoURL
      }
    },
    welcomeMessageUser(){
      console.log('asddfafds',this.userDetail)
    },
    getSelectedUserDetail(selectedUserDataId){
      axios.get(`${this.baseUrl}/carapp/${selectedUserDataId}/getSelectedUserDetail`)
        .then(res=>{
          this.selecteUserProfile = res.data.findeduser
          console.log('selecteUserProfile',this.selecteUserProfile)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyInfoFromMongoDb(){
      axios.get(`${this.baseUrl}/carapp/users/${this.firebaseInfoUser.uid}`)
        .then(res=>{
          console.log('resuserdetail',res)
          this.userDetail = res.data
          console.log('userDetail',this.userDetail)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    async getManufacturer(){
      const res = await fetch('https://private-dc7d79-carsapi1.apiary-mock.com/manufacturers')
      const data = await res.json()
      console.log(data)
      this.brandList = []
      data.forEach(element => {
        this.brandList.push(element.name)
      });
      //this.brandList = data
      console.log('brandlist',this.brandList)
    },
    async getModels(carData){
      const res = await fetch(`https://private-dc7d79-carsapi1.apiary-mock.com/cars`)
      const data = await res.json()
      console.log(data)
      const list = data.filter(object => object.make === carData)
      console.log(list)
      this.modelList = []
      list.forEach(element =>{
        this.modelList.push(element.model)
      })
    },
    async getManufacturer(){
      const res = await fetch('https://private-dc7d79-carsapi1.apiary-mock.com/manufacturers')
      const data = await res.json()
      console.log(data)
      this.brandList = data
      console.log('brandlist',this.brandList)
    },
  },
});
