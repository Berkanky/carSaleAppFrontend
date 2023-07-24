<template>
  <q-page class="bg-grey-3 text-dark">
    <q-card
      flat
      class="text-capitalize bg-transparent"
      style="margin:0 auto;"
      :style="{'width':this.store.mobileActive ? '100%' : '80%'}"
    >
      <q-card-section class="q-pa-md">

      </q-card-section>
      <q-card-section class="text-subtitle2 text-weight-bold">
        <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBeforePage"></q-btn>
        Home > Cars&Vehicles > {{ this.$route.params.id }} ID
      </q-card-section>
      <q-separator color="grey-4" size="3px"></q-separator>
      <q-card-section horizontal>
        <q-card-section class="col">
          <q-card-section horizontal>
            <q-img
              v-on:click="zoomMainImage"
              v-if="this.currentPost.mainImage"
              class="col"
              :src="this.currentPost.mainImage" style="object-fit:cover;border-radius:4px;"></q-img>
            <q-card-section class="col-3">
              <q-card v-for="(data,key) in this.currentPostCarImages()" :key="key">
                <q-img :src="data.image" style="object-fit:cover;" v-on:click="zoomMainImage">
                </q-img>
              </q-card>
              <q-card class="bg-dark" >
                <q-btn
                  v-on:click="zoomMainImage"
                  class="full-width full-height" color="white" flat icon-right="list" :label="this.currentPost.carImages ? this.currentPost.carImages.length : ''"></q-btn>
              </q-card>
            </q-card-section>
          </q-card-section>
          <q-card-section class="bg-white q-mt-md" style="border-radius:4px;">
            <div class="text-overline text-weight-bold text-grey-6">
              {{ this.currentPost.title ?? '' }}
            </div>
            <div class="text-subtitle2 text-weight-bold" style="font-size:17px;">
              {{ this.currentPost.year ?? '' }}
              {{ this.currentPost.brand ?? '' }}
              {{ this.currentPost.model ?? '' }}
              {{ this.currentPost.trim ?? '' }}
            </div>
            <div class="text-h6 text-weight-bold text-capitalize q-mt-sm">
                ${{ this.currentPost.price ?? '' }}
            </div>
          <q-card-section class="text-right">
            <q-btn
              v-on:click="makeAction(data)"
              :flat="this.checkCurrentPostSavedOrNot(data) ? true : false"
              v-for="(data,key) in this.options" size="md" :key="key" class="q-mt-xs q-ma-xs"
              :icon="data.icon" :color="data.color"></q-btn>
          </q-card-section>
        </q-card-section>
        <q-card-section class="bg-white text-subtitle2 text-weight-bold q-mt-md" style="border-radius:4px;">
          <q-btn
            v-on:click="showViewers"
            icon="info" flat color="dark"
            :label="this.currentPost.visiters ? ` Number Of Viewers - ${this.currentPost.visiters.length}` : 'Number Of Viewers - 0'"
             no-caps size="sm"></q-btn>
        </q-card-section>
        <q-card-section class="bg-white q-mt-md row" style="border-radius:4px;">
          <div class="col-4 text-weight-bold q-mt-md">
            <q-icon name="search" color="dark" size="17px"></q-icon>
            {{ this.currentPost.condition ?? 'NaN' }}
          </div>
          <div class="col-4 text-weight-bold q-mt-md">
            <q-icon name="speed" color="dark" size="17px"></q-icon>
            {{ this.currentPost.kilometres ?? 'NaN' }} Km
          </div>
          <div class="col-4 text-weight-bold q-mt-md">
            <q-icon name="info" color="dark" size="17px"></q-icon>
            {{ this.currentPost.transmission ?? 'NaN' }}
          </div>
          <div class="col-4 text-weight-bold q-mt-md">
            <q-icon name="info" color="dark" size="17px"></q-icon>
            {{ this.currentPost.trim ?? 'NaN' }}
          </div>
          <div class="col-4 text-weight-bold q-mt-md">
            <q-icon name="info" color="dark" size="17px"></q-icon>
            {{ this.currentPost.driveTrain ?? 'NaN' }}
          </div>
          <div class="col-4 text-weight-bold q-mt-md">
            <q-icon name="local_gas_station" color="dark" size="17px"></q-icon>
            {{ this.currentPost.fuelType ?? 'NaN' }}
          </div>
        </q-card-section>
        <q-card-section class="text-subtitle1 text-weight-bold">
          Description
        </q-card-section>
        <q-card-section class="bg-white" style="border-radius:4px;">
          <div class="text-subtitle2 text-capitalize">
            {{ this.currentPost.description ?? 'No Description' }}
          </div>
        </q-card-section>
        <q-card-section class="text-subtitle1 text-weight-bold">
          Extras
        </q-card-section>
        <q-card-section class="bg-white" style="border-radius:4px;">
          <div class="text-subtitle2 text-capitalize">
            {{ this.currentPost.extras ?? 'No Extra' }}
          </div>
        </q-card-section>
        <q-card-section class="text-subtitle1 text-weight-bold">
          Car Features
        </q-card-section>
        <q-card-section class="bg-white" style="border-radius:4px;">
          <q-card-section class="text-subitle2" v-for="(data,key) in this.showTypes" :key="key">
            <q-card-section class="row">
              {{ data.label }}
            <q-space></q-space>
              <q-btn flat :icon="checkExpandMoreIcon(data)" color="dark" v-on:click="selectShowType(data)"></q-btn>
            </q-card-section>
            <q-slide-transition>
              <q-card-section class="text-subitle2 text-dark" v-if="this.selectedShowTypes.id === 1" horizontal v-show="this.selectedShowTypes.id === data.id">
                <q-card-section class="col-6 q-pa-sm" horizontal>
                  <div class="col-6  text-left text-subtitle2">
                    <p>Make</p>
                    <p>Model</p>
                    <p>Year</p>
                    <p>Trim</p>
                  </div>
                  <div class="col-6 text-right text-subtitle2 text-weight-bold">
                    <p>{{this.currentPost.brand ?? 'NaN'}}</p>
                    <p>{{this.currentPost.model ?? 'NaN'}}</p>
                    <p>{{this.currentPost.year ?? 'NaN'}}</p>
                    <p>{{this.currentPost.trim ?? 'NaN'}}</p>
                  </div>
                </q-card-section>
                <q-card-section class="col-6 q-pa-sm" horizontal>
                  <div class="col-6 text-left text-subtitle2">
                    <p>Body Type</p>
                    <p>Colour</p>
                  </div>
                  <div class="col-6 text-right text-subtitle2 text-weight-bold">
                    <p>{{this.currentPost.bodyType ?? 'NaN'}}</p>
                    <p>{{this.currentPost.exteriorColor ?? 'NaN'}}</p>
                  </div>
                </q-card-section>
              </q-card-section>
              <q-card-section class="text-subitle2 text-dark" v-if="this.selectedShowTypes.id === 2" horizontal v-show="this.selectedShowTypes.id === data.id">
                <q-card-section class="col-6 q-pa-sm" horizontal>
                  <div class="col-6  text-left text-subtitle2">
                    <p>Transmission</p>
                    <p>DriveTrain</p>
                  </div>
                  <div class="col-6 text-right text-subtitle2 text-weight-bold">
                    <p>{{this.currentPost.transmission ?? 'NaN'}}</p>
                    <p>{{this.currentPost.driveTrain ?? 'NaN'}}</p>
                  </div>
                </q-card-section>
              </q-card-section>
              <q-card-section class="text-subitle2 text-dark" v-if="this.selectedShowTypes.id === 4" horizontal v-show="this.selectedShowTypes.id === data.id">
                <q-card-section class="col-6 q-pa-sm" horizontal>
                  <div class="col-6  text-left text-subtitle2">
                    <p>Fuel Type</p>
                  </div>
                  <div class="col-6 text-right text-subtitle2 text-weight-bold">
                    <p>{{this.currentPost.fuelType ?? 'NaN'}}</p>
                  </div>
                </q-card-section>
              </q-card-section>
              </q-slide-transition>
            </q-card-section>
        </q-card-section>

        <q-card-section class="text-subtitle1 text-weight-bold">
          About The Seller
        </q-card-section>
        <l-map
          style="width:100%;height:350px;border-radius:4px;"
          ref="map" v-model:zoom="zoom" :center="this.currentPostLocationData.length ? this.currentPostLocationData : [47.41322, -1.219482]">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-marker
          :lat-lng="this.currentPostLocationData"
          v-if="this.currentPostLocationData.length"
        ></l-marker>
      </l-map>
        <q-card-section class="bg-white text-dark">
          <div class="text-subtitle2">
            <q-icon name="mail"></q-icon>
            {{ this.createrDetail.email ?? '' }}
          </div>
          <div class="text-overline text-grey-7 text-weight-bold">
            <q-icon name="location_on" size="16px"></q-icon>
            {{ this.currentPost.location ? this.currentPost.location.fullAddress :  '' }}
          </div>
          <div class="text-subtitle2">
            <q-icon name="call"></q-icon>
            {{ this.createrDetail.communicationNumber ?? '' }}
          </div>
        </q-card-section>
        <q-card-section class="text-subtitle1 text-weight-bold">
          Other Listings From This Dealer
        </q-card-section>
        <q-card-section>
          <Carousel :items-to-show="2.5" :wrap-around="false">
            <Slide v-for="(data,key) in this.createrSaleList" :key="key">
              <q-card class="my-card" v-on:click="goDetail(data)">
              <img :src="data.mainImage">
              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">
                  {{ data.year ?? '' }} {{ data.brand ?? '' }} {{ data.model ?? '' }}
                </div>
                <div class="text-subtitle2">
                  {{ data.kilometres ?? '' }} Km
                </div>
                <div class="text-subtitle2">
                  <span style="font-weight:bold;">$</span> {{ data.price ?? '' }}
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
              </q-card-section>
            </q-card>
            </Slide>
            <template #addons>
              <Navigation />
            </template>
          </Carousel>
        </q-card-section>

        </q-card-section>
        <q-card-section class="col-3 text-capitalize">
          <q-card class="q-mt-sm bg-transparent" bordered v-if="this.createrDetail._id">
            <q-card-section horizontal class="q-pa-sm">
              <div class="col-3">
              <q-avatar v-on:click="getUserDetail">
              <q-btn icon="person" color="dark" round v-if="!this.createrDetail.userImage"></q-btn>
              <img
                style="object-fit:Cover;"
                v-if="this.createrDetail.userImage" :src="this.createrDetail.userImage" alt="">
            </q-avatar>
              </div>
              <div class="col text-weight-bold ">
                <div class="text-caption">
                  <q-icon name="mail" color="grey-5"></q-icon>
                  {{ this.createrDetail.email ?? this.createrDetail.name }}
                </div>
                <div class="text-caption">
                  <q-icon name="work" color="grey-5"></q-icon>
                  {{ this.createrDetail.job ?? 'No Job Info' }}
                </div>
              </div>
            </q-card-section>
          </q-card>
          <div class="text-subitlte2 text-blue-4 text-weight-bold q-mt-sm">
            <q-icon name="location_on"></q-icon>
            {{ this.currentPost.location ? this.currentPost.location.fullAddress : 'No Number' }}
          </div>
          <q-input
            class="q-mt-sm"
            readonly
            filled color="blue-4"
            :label="this.createrDetail.communicationNumber ?? ''"
          >
            <template v-slot:prepend>
              <q-icon name="call"></q-icon>
            </template>
          </q-input>
          <q-separator color="grey-3" size="2px" class="q-mt-sm"></q-separator>
          <div class="text-subtitle2 text-weight-bold q-mt-sm">
            <q-icon name="mail"></q-icon>
            Message
          </div>
          <q-input
            class="q-mt-sm"
            v-model="this.messageData.message"
            type="textarea" filled color="dark" label="Enter Message"
          >
            <template v-slot:prepend>
              <q-icon name="chat"></q-icon>
            </template>
          </q-input>
          <q-input
            v-model="this.messageData.phoneNumber"
            filled :label="this.store.userDetail.communicationNumber ?? 'Enter Phone'" class="q-mt-sm">
            <template v-slot:prepend>
              <q-icon name="call"></q-icon>
            </template>
          </q-input>
          <q-btn icon="send" color="blue-4" label="Send Message" no-caps class="q-mt-sm full-width" v-on:click="sendMessage"></q-btn>
          <q-btn icon="share" color="blue-4" label="Share" no-caps class="q-mt-sm full-width" v-on:click="shareThisPost"></q-btn>
          <q-btn icon="sell" color="green-4" class="q-mt-sm full-width" label="Offer Price" no-caps v-on:click="offerPriceButton"></q-btn>
          <q-card class="q-mt-sm bg-transparent" bordered v-if="this.confirmedSalerDetail._id" v-on:Click="showDetail">
            <q-card-section horizontal class="q-pa-sm">
              <div class="col-3">
                <q-avatar>
                  <q-btn icon="person" v-if="!this.confirmedSalerDetail.userImage" color="dark" round></q-btn>
                  <img
                    v-if="this.confirmedSalerDetail.userImage"
                    style="object-fit:cover;"
                    :src="this.confirmedSalerDetail.userImage" alt="">
                </q-avatar>
              </div>
              <div class="col text-weight-bold text-caption">
                <div>
                  {{ this.confirmedSalerDetail.email ?? this.confirmedSalerDetail.name }}
                </div>
                <div class="text-green-4">
                  Approved
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card-section>
    </q-card>
    <userDetailPluginVue v-if="this.store.selecteUserProfileCompActive"/>
    <imagesVue v-if="this.store.imagesCompActive" :currentPost="this.currentPost"/>
    <shareDialogVue
      :currentPost="this.currentPost"
      v-if="this.store.sharedsDialogActive"/>
      <allViewersVue
        :currentPost="this.currentPost"
        v-if="this.store.showViewersDialogActive"/>

      <offerPriceVue
        :currentPost="this.currentPost"
        v-if="this.store.offerPriceCompActive"
      />
  </q-page>
</template>

<script>
import offerPriceVue from '../offer/offerPrice.vue'
import allViewersVue from '../viewers/allViewers.vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import imagesVue from 'src/imagesComp/images.vue';
import userDetailPluginVue from 'src/profilePlugin/userDetailPlugin.vue';
import shareDialogVue from 'src/shareds/shareDialog.vue';
export default {
  components:{
    shareDialogVue,
    userDetailPluginVue,
    imagesVue,
    LMap,
    LTileLayer,
    LMarker,
    Carousel,
    Navigation,
    Slide,
    allViewersVue,
    offerPriceVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      zoom:4,
      selectedShowTypes:{},
      showTypes:[
        {id:1,label:'Overview'},
        {id:2,label:'Mechanical Specs'},
        {id:3,label:'Safety & Security'},
        {id:4,label:'Consumption & Emissions'},
        {id:5,label:'Features'},
        {id:6,label:'Extras'}
      ],
      options:[
        {id:1,icon:'bookmark',color:'green-4'},
        {id:2,icon:'fa-brands fa-facebook',color:'blue-4'},
        {id:3,icon:'fa-brands fa-google',color:'orange-4'},
        {id:4,icon:'fa-brands fa-twitter',color:'blue-5'},
        {id:5,icon:'mail',color:'grey-6'}
      ],
      currentPost:{},
      createrDetail:{},

      messageData:{},
      currentPostLocationData:[],
      createrSaleList:[],
      confirmedSalerDetail:{}
    }
  },
  methods:{
    offerPriceButton(){
      this.store.offerPriceCompActive =! this.store.offerPriceCompActive
    },
    showViewers(){
      this.store.showViewersDialogActive =! this.store.showHistoryDialogActive
      console.log(this.currentPost)
    },
    getSelectedPostVisitDetail(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.currentPost.postId}/getSelectedPostVisitDetail`)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    shareThisPost(){
      this.store.sharedsDialogActive =! this.store.sharedsDialogActive
    },
    showDetail(){
      this.store.selecteUserProfile = this.confirmedSalerDetail
      this.store.selecteUserProfileCompActive = true
    },
    getConfirmedSaleUserDetail(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.currentPost.postId}/getConfirmedSalerDetail`)
        .then(res=>{

          this.confirmedSalerDetail = res.data.confirmedsaleuserdetail
          console.log('getConfirmedSalerDetail',this.confirmedSalerDetail)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    zoomMainImage(){
      this.store.imagesCompActive = true
    },
    goDetail(data){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/checkInAllSalePost`)
        .then(res=>{
          console.log(res)
          if(!res.data.removed){
            this.$router.push({path:`/detailCarSalePost/${data.postId}`})
          }else{
            this.$q.notify({
              type:'negative',
              message:'Post Deleted !',
              position:'right',
              timeout:700
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getSelectedUserSaledCars(newData){
      axios.get(`${this.store.baseUrl}/carapp/${newData.userDetail}/selectedUserAllSalePosts`)
        .then(res=>{
          console.log('selectedUserAllSalePosts',res)
          this.createrSaleList = res.data.selecteduserpostslist
          this.createrSaleList = this.createrSaleList.filter(object => object.postId !== this.currentPost.postId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getCurrentPostLocations(newData){
      if(newData.location){
        this.currentPostLocationData[0] = newData.location.lat ?? ''
        this.currentPostLocationData[1] = newData.location.lng ?? ''
        console.log('currentPostLocationData',this.currentPostLocationData)
      }
    },
    checkExpandMoreIcon(data){
      if(data.id === this.selectedShowTypes.id){
        return 'expand_less'
      }else{
        return 'expand_more'
      }
    },
    selectShowType(data){
      if(!this.selectedShowTypes.id){
        this.selectedShowTypes = data
      }else if(this.selectedShowTypes.id !== data.id){
        this.selectedShowTypes = data
      }else{
        this.selectedShowTypes = {}
      }
    },
    makeAction(data){
      if(data.id === 1){
        console.log(data)
        const postData = this.currentPost
        axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/addMySavedPostsList`,postData)
          .then(res=>{
            console.log(res)
            if(res.data.removed){
              this.store.mySavedPostsList = this.store.mySavedPostsList.filter(object => object.postId !== this.currentPost.postId)
            }else{
              this.store.mySavedPostsList.push(this.currentPost)
            }
          })
          .catch(err=>{
            console.log(err)
          })
      }
    },
    checkCurrentPostSavedOrNot(data){
      const result = this.store.mySavedPostsList.some(object => object.postId === this.currentPost.postId)
      if(result){
        if(data.id === 1){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    getUserDetail(){
      this.store.selecteUserProfile = this.createrDetail
      this.store.selecteUserProfileCompActive = true
    },
    sendMessage(){
      const messagePost = {
        messageId:uuidv4(),
        senderId:this.store.userDetail._id,
        message:this.messageData.message,
        selectedUserId:this.currentPost.userDetail,
        senderPhoneNumber:this.store.userDetail.communicationNumber ?? '',
        postId:this.currentPost.postId
      }
      const sendedData = {
        messagePost:messagePost,
        senderUserDetail:this.store.userDetail
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.currentPost.userDetail}/sendMessage`,sendedData)
        .then(res=>{
          console.log(res)
          this.$q.notify({
            message:'Message Sended.',
            type:'positive',
            timeout:700,
            position:'right'
          })
          this.messageData = {}
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goBeforePage(){
      this.$router.push({path:'/cars'})
    },
    findUserDetail(){
      axios.get(`${this.store.baseUrl}/carapp/${this.currentPost.postId}/getCreaterDetail`)
        .then(res=>{
          console.log('createrDetail',res)
          this.createrDetail = res.data.createrdetail
        })
        .catch(err=>{
          console.log(err)
        })
    },
    currentPostCarImages(){
      if(this.currentPost.carImages && this.currentPost.carImages.length){
        const list = this.currentPost.carImages.slice(0,2)
        return list
      }
    },
    getCurrentSalePost(postId){
      axios.get(`${this.store.baseUrl}/carapp/${postId.id}/getSelectedPostDetail`)
        .then(res=>{
          console.log('getSelectedPostDetail',res)
          this.currentPost = res.data.selectedpost
          const newData = this.currentPost
          this.getCurrentPostLocations(newData)
          this.getSelectedUserSaledCars(newData)
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  created(){
    this.$watch(
      () => this.$route.params,
      () => {
        const postId = this.$route.params
        console.log('postId',postId)
        this.getCurrentSalePost(postId)
      },
      { immediate: true }
    )
  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getMySavedPosts()
        }
      },
      immediate:true,
      deep:true
    },
    currentPost:{
      handler(newValue,oldValue){
        if(newValue.postId !== '' && newValue.postId !== null){
          this.findUserDetail()
          this.getConfirmedSaleUserDetail()
          this.getSelectedPostVisitDetail()
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>

</style>
