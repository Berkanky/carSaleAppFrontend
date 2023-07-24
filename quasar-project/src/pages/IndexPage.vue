<template>
  <q-page class=" bg-grey-2">
    <div class="full-width" v-if="this.store.mobileActive === false">
      <q-card style="height:350px;">
        <q-img
          v-on:click="this.store.getRandomPhoto()"
          style="object-fit:Cover;height:100%;"
          :src="this.store.homePagePhotoUrl"></q-img>
      </q-card>
    </div>
    <q-card
      :style="{
          'width':this.store.mobileActive ? '100%' : '900px',
          'margin':this.store.mobileActive ? '0 auto' : '-5% auto'
        }"
      class="text-capitalize text-dark">
        <q-card-section class="row q-pa-lg">
            <div class="col-12 col-md-3 col-sm-3 text-subtitle2 text-weight-bold" style="font-size:18px;">
              Find Your Next Car
              <q-icon name="location_on " color="grey-6" size="21px"></q-icon>
            </div>
            <div class="col-12 col-md-3 col-sm-3 text-subtitle2 row">
              All In Canada
              <span class="q-ml-xs text-primary" style="cursor:grab;" v-on:click="setLocationButton">set location</span>
            </div>
            <div class="col text-right">
              <span class="text-primary" style="cursor:grab;">More Filter</span>
            </div>
        </q-card-section>
        <q-card-section class="row">
          <q-select
            v-model="this.store.filterData.brand"
            class="col"
            @update:model-value="selectNewBrandForFilter"
            filled color="dark" label="Make"
            :options="this.brandList"></q-select>
          <q-select
            :disable="this.store.filterData.brand ? false : true"
            v-model="this.store.filterData.model"
            class="col"
            filled color="dark" label="Model"
            :options="this.store.modelList"
          ></q-select>
          <q-input
            v-model="this.store.filterData.price"
            filled color="dark" label="max price" type="number" class="col">
            <template v-slot:prepend>
                  <q-icon name="attach_money"></q-icon>
            </template>
          </q-input>
          <q-input
            v-model="this.store.filterData.kilometres"
            filled color="dark" label="kilometres" type="number" clear-icon="col">
          </q-input>
        </q-card-section>
        <q-card-section class="row" v-if="this.checkStoreLocationFilterData()">
          <q-input
            readonly
            class="col-12 col-md-6 col-sm-6"
            filled color="dark" :label="this.store.locationFilterData.country ?? 'Country'">
            <template v-slot:prepend>
              <q-icon name="flag"></q-icon>
            </template>
          </q-input>
          <q-input
            readonly
            class="col-12 col-md-6 col-sm-6"
            filled color="dark" :label="this.store.locationFilterData.city ?? 'City'">
            <template v-slot:prepend>
              <q-icon name="location_city"></q-icon>
            </template>
          </q-input>
          <q-input
            class="col-12"
            type="textarea" readonly
            filled color="dark" :label="this.store.locationFilterData.fullAddress ?? 'Address'">
              <template v-slot:prepend>
                <q-icon name="location_on"></q-icon>
              </template>
            </q-input>
        </q-card-section>
        <q-card-section class="text-right">
          <q-btn
            v-if="this.checkStoreFilterData()"
            icon="clear_all" color="red-4" label="Clear" no-caps v-on:click="clearFilterData"></q-btn>
          <q-btn
            v-on:click="filterAll"
            v-if="this.checkStoreFilterData()"
            icon="filter_list" color="green-4" label="Results" no-caps></q-btn>
        </q-card-section>
    </q-card>
    <div
      :style="{
          'width':this.store.mobileActive ? '100%' : '900px',
          'margin':this.store.mobileActive ? '0 auto;' : '7% auto'

        }"
      class="">
      <div class="text-left q-pa-sm text-subtitle2 text-weight-bold text-dark">
        <q-icon name="history" size="19px" color="grey-7"></q-icon>
        Continue Your Search's
      </div>
      <div class="row">
        <q-card
          v-on:click="findWithSearch(data)"
          style="cursor:grab;"
          v-for="(data,key) in this.lastSearchs" :key="key"
          class="col-3 text-capitalize q-pa-xs">
          <q-card-section class="text-subtitle2 text-weight-bold text-dark">
            {{ data.search }}
          </q-card-section>
        </q-card>
      </div>
    </div>
  <!--   <div
      style="margin:5% auto;"
      class=""
      :style="{'width':this.store.mobileActive ? '100%' : '900px'}"
      >
        <div class="text-left q-pa-sm text-subtitle2 text-weight-bold text-dark">
          <q-icon name="list" size="19px" color="grey-7"></q-icon>
          Some Cars Maybe You Interest
        </div>
    </div> -->
    <div
      style="margin:0 auto;"
      :style="{'width':this.store.mobileActive ? '100%' : '900px'}"
      class=""
    >
    <Carousel  v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="(slide,key) in this.showLimitPosts" :key="key">
        <q-card
            v-on:click="selectPostCarSale(slide)"
            class="text-dark text-capitalize q-ma-xs">
            <img :src="slide.mainImage" style="object-fit:cover;height:150px;width:100%;">
            <q-card-section>
              <div class="text-caption text-center">
                {{ slide.kilometres ?? '' }} Km
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              {{ slide.price ?? '' }} $
            </q-card-section>
          </q-card>
      </Slide>
    </Carousel>
    </div>
    <div
      style="margin:0 auto;"
      :style="{'width':this.store.mobileActive ? '100%' : '900px'}"
      class=""
    >
    <Carousel  v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="(data,key) in this.store.bodyOption" :key="key" >
        <q-btn
          v-on:Click="selectBodyType(data)"
          :label="data"
          color="grey-8"
          glossy
          icon="settings"
          class="btn-fixed-width q-ma-xs col"></q-btn>
      </Slide>
    </Carousel>
    </div>
    <div
      :style="{
          'width':this.store.mobileActive ? '100%' : '900px',
          'margin':this.store.mobileActive ? '0 auto;' : '3% auto'
        }"
      class="">
      <div class="row q-pa-sm text-subtitle2 text-weight-bold text-dark">
        <q-btn icon="info" label="Popular Brands" flat no-caps color="grey-8"></q-btn>
        <q-space></q-space>
        <q-btn
          v-on:click="showAllCars"
          icon-right="chevron_right" flat no-caps label="Show  All" color="grey-8"></q-btn>
      </div>
      <Carousel  v-bind="settings" :breakpoints="breakpoints">
      <Slide  v-for="(data,key) in this.store.brandList.slice(0,10)" :key="key">
                <q-card
                  v-on:click="findWithSearch(data)"
                  style="cursor:grab;"
                  class="text-capitalize q-pa-xs bg-grey-9 col"

                  >
          <q-card-section class="text-subtitle2 text-center">
            <q-icon name="info" color="white"></q-icon>
            {{ data.name }}
          </q-card-section>
        </q-card>
      </Slide>
    </Carousel>
    </div>
    <mapVue v-if="this.store.mapCompActive"/>
    <followsVue v-if="this.store.myFollowsDialogActive"/>
    <notifyVue v-if="this.store.notifyDialogActive"/>
  </q-page>
</template>

<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import mapVue from '../mapComp/map.vue'
import axios from 'axios'
import {useCounterStore} from  '../stores/store'
import { defineComponent } from 'vue'
import followsVue from 'src/follows/follows.vue'
import notifyVue from 'src/notify/notify.vue'
export default defineComponent({
  components:{
    mapVue,
    Carousel,
    Slide,
    Pagination,
    Navigation,
    followsVue,
    notifyVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      brandList:[],
      lastSearchs:[],
      showLimitPosts:[],
      settings: {
      itemsToShow: 1,
      snapAlign: 'center',
    },
      // breakpoints are mobile first
      // any settings not specified will fallback to the carousel settings
      breakpoints: {
        // 700px and up
        700: {
          itemsToShow: 3.5,
          snapAlign: 'center',
        },
        // 1024 and up
        1024: {
          itemsToShow: 5,
          snapAlign: 'start',
        },
      },
    }
  },
  methods:{
    showAllCars(){
      this.$router.push({path:'/cars'})
    },
    selectBodyType(data){
      console.log(data)
      const filterData = {
        bodyType:data
      }
      axios.put(`${this.store.baseUrl}/carapp/filterAllPosts`,filterData)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    selectPostCarSale(slide){
      console.log(slide)
    },
    findWithSearch(data){
      console.log(data)
      const filterData = {
        brand:data.search
      }
      axios.put(`${this.store.baseUrl}/carapp/filterAllPosts`,filterData)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getLastSearches(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/getAllLastSearchs`)
        .then(res=>{
          console.log(res)
          this.lastSearchs = res.data.mylastsearch.lastSearchsList
          console.log('lastSearchs',this.lastSearchs)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    postToLastSearch(){
      const newData = {
        search:this.store.filterData.brand ?? ''
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/postToLastSearch`,newData)
        .then(res=>{
          console.log('resremovefromlist',res)
          this.getLastSearches()
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkStoreLocationFilterData(){
      const valuesLength = Object.values(this.store.locationFilterData).length
      if(valuesLength > 0 ){
        return true
      }else{
        return false
      }
    },
    setLocationButton(){
      this.store.mapCompActive = true
    },
    filterAll(){
      const filterData = this.store.filterData
      axios.put(`${this.store.baseUrl}/carapp/filterAllPosts`,filterData)
        .then(res=>{
          console.log(res)
          this.postToLastSearch()
        })
        .catch(err=>{
          console.log(err)
        })

    },
    checkStoreFilterData(){
      const valuesLength = Object.values(this.store.filterData).length
      if(valuesLength > 0){
        return true
      }else{
        return false
      }
    },
    clearFilterData(){
      this.store.filterData = {}
      this.store.locationFilterData = {}
      this.store.getAllPosts()
    },
    selectNewBrandForFilter(val){
      this.store.filterData.brand = val
      const carData = val
      console.log(carData)
      this.store.getModels(carData)
    },
    catchMessage(){
      this.store.welcomeMessageUser()
    }
  },
  created(){
    this.store.getRandomPhoto()
    this.store.getManufacturer()
    this.store.getAllPosts()
    this.store.getManufacturer()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // access to component public instance via `vm`
      console.log(to,from)
      if(from.path === '/login' && vm.$route.path === '/'){
        vm.$q.notify({
          type:'positive',
          message:`${vm.store.userDetail.email ?? vm.store.userDetail.phoneNumber} Welcome.`,
          timeout:1000,
          avatar:`${vm.store.firebaseInfoUser.photoURL ?? 'person'}`,
          position:'top',
      })
      }
    })
  },
  watch:{
    'store.allCarSalePosts':{
      handler(newValue,oldValue){
        if(newValue.length){
          const newList = newValue.slice(0,10)
          this.showLimitPosts = newList
          console.log('showLimitPosts',this.showLimitPosts)
        }
      },
      immediate:true,
      deep:true
    },
    'store.locationFilterData':{
      handler(newValue,oldValue){
        const valuesLength = Object.values(newValue).length
        if(valuesLength > 0){
          const filtered = {
            city:newValue.city,
            country:newValue.country
          }
          this.store.filterData.location = filtered
          console.log('fil',this.store.filterData)
        }
      },
      immediate:true,
      deep:true
    },
    'store.filterData':{
      handler(newValue,oldValue){
        if(newValue.brand != '' && newValue.brand != null){
          console.log(this.store.filterData)
          const carData = this.store.filterData.brand
          //this.store.getModels(carData)
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.getLastSearches()
        }
      },
      immediate:true,
      deep:true
    },
    'store.brandList':{
      handler(newValue,oldValue){
        if(newValue.length){
          let newList = []
          this.store.brandList.forEach(element => {
            newList.push(element.name)
          });
          this.brandList = newList
        }
      },
      immediate:true,
      deep:true
    }
  }
})
</script>


<style scoped>
</style>
