<template>
  <q-card class="bg-grey-3 text-dark">
    <q-card-section class="row">
      <q-btn :icon="this.checkLoginAuthForIcon()" :label="this.store.userDetail.authType ?? ''" flat size="sm"></q-btn>
      <q-btn 
        :icon="this.checkLoginAuthForIcon()" size="sm" flat 
        color="dark"
        :label="this.checkLoginAuthType()"></q-btn>
      <q-space></q-space>
      <q-avatar>
        <img 
          :src="this.store.checkImage()" alt="" 
          v-if="this.store.checkImageOrNot()" style="object-fit:Cover;">
          <q-btn icon="person" color="dark" round size="md"></q-btn>
      </q-avatar>
    </q-card-section>
    <q-card-section class="row">
      <q-card-section class="col-12 col-md-3 col-sm-3 text-center">
        <div class="text-right">
          <q-btn-dropdown color="dark" flat>
            <q-list>
              <q-item clickable v-close-popup @click="selectOption(data)" v-for="(data,key) in this.options" :key="key">
                <q-item-section>
                  <q-item-label>{{data.label}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-avatar size="170px">
          <img 
            v-touch-hold:2000.mouse="event => removeProfilePic()"
            :src="this.store.checkImage()" alt="" v-if="this.store.checkImageOrNot()" style="object-fit:cover;">
          <q-btn icon="person" color="dark" round v-if="!this.store.checkImageOrNot()"></q-btn>
        </q-avatar>
        <q-card-section class="row">
          <q-card 
            class="col-12 col-md-4 col-sm-4" dark v-for="(data,key) in this.store.userDetail.userImages" bordered 
            :key="key" style="height:80px;">
            <q-img 
              loading="lazy"
              spinner-color="white"
              :src="data.image" style="height:100%;object-fit:cover;"></q-img>
          </q-card>
        </q-card-section>
      </q-card-section>
      <q-card-section class="col col-md col-sm text-center row">
        <q-input 
            class="col-12 col-md-6 col-sm-6 q-mt-xs"
            v-model="this.userData.name"
            :label="this.store.userDetail.name ?? 'Enter Your Name'"
            filled color="dark">
              <template v-slot:prepend>
                <q-icon name="person"></q-icon> 
              </template>
          </q-input>
          <q-input 
            class="col-12 col-md-6 col-sm-6 q-mt-xs"
            v-model="this.userData.lastName"
            :label="this.store.userDetail.lastName  ?? 'Enter Your LastName'"
            filled color="dark">
              <template v-slot:prepend>
                <q-icon name="person"></q-icon>
              </template>
          </q-input>
          <q-input 
            class="col-12 q-mt-xs"
            color="dark"
            :label="this.store.userDetail.description ?? 'Enter Description'"
            type="textarea" filled v-model="this.userData.description">
              <template v-slot:prepend>
                <q-icon name="description"></q-icon>
              </template>
          </q-input>
          <q-input 
            v-model="this.userData.job"
            :label="this.store.userDetail.job ?? 'Enter Your Job'"
            class="col-12 col-md-6 col-sm-6 q-mt-xs" filled color="dark">
            <template v-slot:prepend>
              <q-icon name="work"></q-icon>
            </template> 
          </q-input>
          <q-input
            type="tel"
            v-model="this.userData.communicationNumber"
            :label="this.store.userDetail.communicationNumber ?? 'Enter Communication Number'"
            class="col-12 col-md-6 col-sm-6 q-mt-xs" filled color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="call"></q-icon></template> 
          </q-input>
          <q-card-section class="q-mt-xs col-12" horizontal>
              <q-card class="col bg-grey-4" style="height:160px;">
                <q-card-section horizontal style="height:160px;">
                  <q-btn 
                    v-if="!this.checkMyLocation()"
                    icon="location_on" color="green" 
                    v-on:click="getCurrentLocation" class="col-2"></q-btn>
                  <q-btn 
                    v-if="this.checkMyLocation()"
                    icon="location_on" color="red" 
                    v-on:click="removeCurrentLocation" class="col-2"></q-btn>
                  <q-card-section class="col text-grey-7 text-left" v-if="this.checkMyLocation()">
                    <div class="text-subtitle2 q-pa-sm text-weight-bold">
                      <q-icon name="flag" color="grey-6" size="17px"></q-icon>
                      Country - {{ this.getCountry() }}
                    </div>
                    <div class="text-subtitle2 q-pa-sm text-weight-bold">
                      <q-icon name="location_city" color="grey-6" size="17px"></q-icon>
                      City - {{ this.getCity() }}
                    </div>
                    <div class="text-subtitle2 q-pa-sm text-weight-bold">
                      <q-icon name="home" color="grey-6" size="17px"></q-icon>
                      Adress - {{ this.getFullAddress() }}
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-card-section>
            <q-card-section class="text-right col-12" v-if="this.checkUserData()">
              <q-btn icon="clear_all" color="red" v-on:click="clearAll"></q-btn>
              <q-btn icon="save" color="green" v-on:click="updateUserData"></q-btn>
            </q-card-section>
      </q-card-section>
    </q-card-section>
    <addImages v-if="this.store.profileImageCompActive"/>
  </q-card>
</template>

<script>
import axios from 'axios'
import addImages from './addImages.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    addImages
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      options:[
        {id:1,label:'Images'},
        {id:2,label:'Clear Profile Picture'}
      ],
      selectedOption:{},
      userData:{},
      currentLocation:{}
    }
  },
  methods:{
    checkLoginAuthType(){
      if(this.store.userDetail.authType === 'google'){
        return this.store.userDetail.email
      }else if(this.store.userDetail.authType === 'phoneNumber'){
        return this.store.userDetail.phoneNumber
      }else if(this.store.userDetail.authType === 'email'){
        return this.store.userDetail.email
      }
    },
    checkLoginAuthForIcon(){
      if(this.store.userDetail.authType === 'google'){
        return 'fa-brands fa-google'
      }else if(this.store.userDetail.authType === 'phoneNumber'){
        return 'call'
      }else if(this.store.userDetail.authType === 'email'){
        return 'mail'
      }
    },
    clearAll(){
      this.userData = {}
    },  
    updateUserData(){
      console.log(this.userData)
      const userData = this.userData
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/updateCurrentUser`,userData)
        .then(res=>{
          console.log(res)
          this.userData = {}
          this.store.userDetail = res.data
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkUserData(){
      const keys = Object.keys(this.userData);
      return keys.length > 0 && Object.values(this.userData).some(value => value !== undefined) && Object.values(this.userData).some(value => value !== '')
    },
    getFullAddress(){
      const name = this.store.userDetail.locationDetails.fullAddress ?? ''
      return name
    },
    getCountry(){
      const name = this.store.userDetail.locationDetails.country ?? ''
      return name
    },
    getCity(){
      const name = this.store.userDetail.locationDetails.city ?? ''
      return name
    },
    removeCurrentLocation(){
      const locationData = {}
      axios.delete(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeLocation`,locationData)
        .then(res=>{
          console.log(res)
          this.store.userDetail = res.data.myacc
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkMyLocation(){
      if(this.store.userDetail.locationDetails){
        return true
      }else{
        return false
      }
    },
    updateLocation(){
      const locationData = this.currentLocation
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/updateLocation`,locationData)
        .then(res=>{
          console.log(res)
          this.store.userDetail = res.data.myacc
        })
        .catch(err=>{
          console.log(err)
        })
    },
    async getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.currentLocation.lat = position.coords.latitude
            this.currentLocation.lng = position.coords.longitude
          },
          error => {
            console.log(error)
          }
        )
        if(this.currentLocation.lat && this.currentLocation.lng){
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${this.currentLocation.lat}+${this.currentLocation.lng}&key=a7ac3cc8ba514f0287f82a6a306eabc8`);
          const data = await response.json();
          console.log(data)
          this.currentLocation.city = data.results[0].components.province
          this.currentLocation.country = data.results[0].components.country
          this.currentLocation.fullAddress =  data.results[0].formatted
          console.log('currentLocation',this.currentLocation)
          this.updateLocation()
        }else{
          this.$q.notify({
            type:'negative',
            message:'Tekrar Deneyiniz !',
            timeout:700,
            position:'center'
          })
        }
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },
    removeProfilePic(){
      const selectedImage = {}
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeProfilePic`,selectedImage)
        .then(res=>{
          console.log(res)
          this.store.userDetail = res.data.myacc
        })
        .catch(err=>{
          console.log(err)
        })
    },
    selectOption(data){
      this.selectedOption = data
      if(data.id === 2){
        axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeProfilePic`)
          .then(res=>{
            console.log(res)
            this.store.userDetail.userImage = ''
          })
          .catch(err=>{
            console.log(err)
          })
      }else if(data.id === 1){
        this.store.profileImageCompActive = true
      }
    },
  },
  created(){
    
  },
  mounted(){
  },
  watch:{

  }
}
</script>

<style>

</style>
