<template>
  <q-card
    v-if="this.currentPost.postId"
    class="bg-grey-3 text-dark">
    <q-card-section class="row">
      <div class="text-subtitle2 text-grey-8 text-weight-bold text-left q-pa-md">
        <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
        <q-icon name="edit"></q-icon>
        {{ this.currentPost.postId }} Update

      </div>
    </q-card-section>
    <q-card-section horizontal>
      <q-card-section class="col-12 col-md-7 col-sm-7">
        <q-card-section class="text-right">
          <upload @currentImageData="getcurrentImageData"/>
        </q-card-section>
        <q-card-section class="text-left">
          <div class="text-subtitle2 text-capitalize text-weight-bold text-grey-6">
            <q-icon name="info"></q-icon>
            Select 4 Image For Post
          </div>
        </q-card-section>
        <q-card-section>
          <q-card style="height:250px;" v-touch-hold:2000.mouse="event => removeMainImage()">
            <q-img :src="this.carData.mainImage ?? this.currentPost.mainImage" style="object-fit:cover;height:100%;"></q-img>
          </q-card>
        </q-card-section>
        <q-card-section class="row">
          <q-card
            v-on:click="makeMainImage(data)"
            v-for="(data,key) in this.currentPost.carImages" :key="key"
            class="col-12 col-md-4 col-sm-4" style="height:150px;">
            <q-img style="height:100%;object-fit:cover;" :src="data.image">
              <div class="absolute-top-right bg-transparent">
                <q-btn icon="delete_forever" color="dark" round v-on:click="removeFromList(data)" size="sm"></q-btn>
              </div>
            </q-img>
          </q-card>
          <q-card
            v-on:click="makeMainImage(data)"
            v-for="(data,key) in this.selectedImages" :key="key"
            class="col-12 col-md-4 col-sm-4" style="height:150px;">
            <q-img style="height:100%;object-fit:cover;" :src="data.image">
              <div class="absolute-top-right bg-transparent">
                <q-btn icon="remove" color="dark" round v-on:click="removeFromSelectedImages(data)" size="sm"></q-btn>
              </div>
            </q-img>
          </q-card>
        </q-card-section>
        <q-card-section class="q-mt-xs row">
      <q-select
        :options="this.conditionOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled :label="this.currentPost.condition ?? 'Condition'"  v-model="this.carData.condition" color="dark">
      </q-select>
      <q-input
        type="number"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled :label="this.currentPost.kilometres ?? 'Kilometres'" v-model="this.carData.kilometres" color="dark">

      </q-input>
      <q-select
        :options="this.transmissionOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled :label="this.currentPost.transmission ?? 'Transmission'" v-model="this.carData.transmission" color="dark">
      </q-select>
      <q-select
        :options="this.fuelTypeOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled :label="this.currentPost.fuelType ?? 'Fuel Type'" v-model="this.carData.fuelType" color="dark">

      </q-select>
      <q-input
        type="text"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled :label="this.currentPost.trim ?? 'Trim'" v-model="this.carData.trim" color="dark">
      </q-input>
      <q-select
        :options="this.bodyOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled :label="this.currentPost.bodyType ?? 'Body Type'" v-model="this.carData.bodyType" color="dark">
      </q-select>
      <q-select
        type="number"
        :options="this.store.sellerTypeOptions"
        label="Select Seller Type" class="col-12 col-md-6 col-sm-6 q-pa-xs"
        filled color="dark" v-model="this.carData.sellerType"
        ></q-select>
      <q-btn
        v-on:click="this.store.colorCompActive =! this.store.colorCompActive"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" :color="this.carData.exteriorColor ?? 'grey-4'"
        :label="this.carData.exteriorColor ?? 'Select Color'" icon="settings"></q-btn>
        <q-select
          filled :label="this.currentPost.cylinders ?? 'Select Cylinder'"
          v-model="this.carData.cylinders" class="col-12 col-md-6 col-sm-6 q-pa-xs" color="dark"
          :options="this.store.cylindersOptions"
        ></q-select>
        <q-select
          filled :label="this.currentPost.engineSize ?? 'Select Engine Size'"
          v-model="this.carData.engineSize" class="col-12 col-md-6 col-sm-6 q-pa-xs" color="dark"
          :options="this.store.engineSizeOptions"
        ></q-select>
        <q-select
          filled :label="this.currentPost.doors ?? 'Select Door Type'"
          v-model="this.carData.doors" class="col-12 col-md-6 col-sm-6 q-mt-xs q-pa-xs" color="dark"
          :options="this.store.doorOptions"
        ></q-select>
        <q-select
          filled :label="this.currentPost.driveTrain ?? 'Select Drive Train Type'"
          v-model="this.carData.driveTrain" class="col-12 col-md-6 col-sm-6 q-mt-xs q-pa-xs" color="dark"
          :options="this.store.driveTrainOptions"
        ></q-select>
        <q-input
          type="textarea"
          class="col-12 q-mt-xs"
          filled color="dark"
          :label="this.currentPost.extras ?? 'Enter Extras'"
          v-model="this.carData.extras"
        ></q-input>
    </q-card-section>
      </q-card-section>
      <q-card-section class="col col-md col-sm">
        <q-input
          type="text"
          v-model="this.carData.title"
          filled color="dark" :label="this.currentPost.title ?? 'Title'">
          <template v-slot:prepend>
            <q-icon name="title"></q-icon>
          </template>
        </q-input>
        <q-input
          type="textarea" v-model="this.carData.description"
          filled color="dark" :label="this.currentPost.description ?? 'Description'" class="q-mt-xs">
          <template v-slot:prepend>
            <q-icon name="info"></q-icon>
          </template>
        </q-input>
        <q-card-section horizontal class="q-mt-sm">
          <q-btn-dropdown color="dark" :label="this.currentPost.brand  ?? 'Brand'" icon="info" no-caps class="col-12 col-md-6 col-sm-6">
            <q-list>
              <q-item clickable v-close-popup @click="selectBrand(data)" v-for="(data,key) in this.brandList" :key="key">
                <q-item-section>
                  <q-item-label>{{data.name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown
            :disable="this.carData.brand ? false : true"
            :label="this.currentPost.model ?? 'Model'" color="dark" class="col-12 col-md-6 col-sm-6">
            <q-list>
              <q-item clickable v-close-popup @click="selectModel(data)" v-for="(data,key) in this.modelList" :key="key">
                <q-item-section>
                  <q-item-label>{{data.model}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-card-section>
        <q-card-section horizontal class="q-mt-sm">
          <q-input
            v-model="this.carData.price"
            type="number" :label="this.currentPost.price ?? 'Price'" class="col-12 col-md-6 col-sm-6" filled color="dark">
              <template v-slot:prepend>
                <q-icon name="currency_lira"></q-icon>
              </template>
            </q-input>
            <q-input
              v-model="this.carData.year"
            type="number" :label="this.currentPost.year ?? 'Year'" class="col-12 col-md-6 col-sm-6" filled color="dark">
              <template v-slot:prepend>
                <q-icon name="event"></q-icon>
              </template>
            </q-input>
        </q-card-section>
        <q-card-section horizontal>
          <mapVue />
        </q-card-section>
        <q-card-section horizontal class="q-mt-sm">
          <q-input
            :label="this.store.carDataLocation.country ?? this.currentPost.location.country "
            class="col-12 col-md-6 col-sm-6" filled color="dark"
            readonly
            >
              <template v-slot:prepend>
                <q-icon name="flag"></q-icon>
              </template>
            </q-input>
            <q-input
            :label="this.store.carDataLocation.city  ?? this.currentPost.location.city"
            class="col-12 col-md-6 col-sm-6" filled color="dark"
            readonly
            >
            <template v-slot:prepend>
                <q-icon name="location_city"></q-icon>
              </template>
            </q-input>
        </q-card-section>
        <q-card-section horizontal class="q-mt-xs">
          <q-input
            readonly
            :label="this.store.carDataLocation.fullAddress ?? this.currentPost.location.fullAddress"
            class="col"
            type="textarea" filled
          >
          <template v-slot:prepend>
                <q-icon name="location_on"></q-icon>
              </template>
          </q-input>
        </q-card-section>
      </q-card-section>
    </q-card-section>
    <q-card-section class="text-right">
      <q-btn icon="clear_all " color="red" v-on:click="clearAll"></q-btn>
      <q-btn icon="send" color="green" v-on:click="updatePost"></q-btn>
    </q-card-section>
    <colorOptionComp v-if="this.store.colorCompActive" @carDataColor="getcarDataColor"/>
  </q-card>
</template>

<script>
import colorOptionComp from '../carSaleComp/colorOptionComp.vue';
import mapVue from '../components/map.vue'
import upload from 'src/components/upload.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    upload,
    mapVue,
    colorOptionComp
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      carData:{},
      currentPost:{},
      brandList:[],
      modelList:[],
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
      selectedImages:[]
    }
  },
  methods:{
    getcarDataColor(data){
      if(data){
        this.carData.exteriorColor = data
        this.store.colorCompActive = false
        console.log('carData',this.carData)
      }
    },
    goBack(){
      this.$router.go(-1)
    },
    updateInMyPosts(){
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.currentPost.postId}/updateInMyPosts`)
        .then(res=>{
          console.log(res)
          this.$router.push({path:'/profile'})
          this.store.carDataLocation = {}
          this.selectedImages = []
          this.carData = {}
        })
        .catch(err=>{
          console.log(err)
        })
    },
    makeMainImage(data){
      this.carData.mainImage = data.image
    },
    removeFromSelectedImages(data){
      this.selectedImages = this.selectedImages.filter(object => object.imageId !== data.imageId)
    },
    removeMainImage(){
      if(this.currentPost.mainImage){
        axios.put(`${this.store.baseUrl}/carapp/${this.currentPost.postId}/removeMainImage`)
          .then(res=>{
            console.log(res)
            this.currentPost.mainImage = ''
          })
          .catch(err=>{
            console.log(err)
          })
      }
    },
    removeFromList(data){
      axios.put(`${this.store.baseUrl}/carapp/${this.currentPost.postId}/${data._id}/removeImage`)
        .then(res=>{
          console.log(res)
          this.currentPost.carImages = this.currentPost.carImages.filter(object => object._id !== data._id)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearAll(){
      //this.$router.go(-1)
      this.carData = {}
      this.store.carDataLocation = {}
    },
    updatePost(){
      console.log(this.carData)
      const newData = {
        carData:this.carData,
        location:this.store.carDataLocation ?? this.currentPost.location,
        selectedImages:this.selectedImages
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.currentPost.postId}/updatePost`,newData)
        .then(res=>{
          console.log(res)
          this.updateInMyPosts()
        })
        .catch(err=>{
          console.log(err)
        })
    },
    async getManufacturer(){
      const res = await fetch('https://private-dc7d79-carsapi1.apiary-mock.com/manufacturers')
      const data = await res.json()
      console.log(data)
      this.brandList = data
      console.log('brandlist',this.brandList)
    },
    async getModels(carData){
      const res = await fetch(`https://private-dc7d79-carsapi1.apiary-mock.com/cars`)
      const data = await res.json()
      console.log(data)
      const list = data.filter(object => object.make === carData.name)
      console.log(list)
      this.modelList = list
    },
    selectModel(data){
      this.carData.model = data.model
      console.log(this.carData)
    },
    selectBrand(data){
      this.carData.brand = data.name
      console.log(this.carData)
      const carData = data
      console.log(carData)
      this.getModels(carData)
    },
    getSelectedPostDetail(postId){
      axios.get(`${this.store.baseUrl}/carapp/${postId}/getSelectedPostDetail`)
        .then(res=>{
          console.log('getSelectedPostDetail',res)
          this.currentPost = res.data.selectedpost
          console.log('getSelectedPostDetail',this.currentPost)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getcurrentImageData(data){
      if(data){
        if(this.selectedImages.length<5){
          this.selectedImages.push({image:data.image,imageId:data.imageId})
          this.carData.mainImage = data.image
        }
      }
    }
  },
  created(){
    this.getManufacturer()
    this.$watch(
      () => this.$route.params,
      () => {
        console.log(this.$route.params)
        const postId = this.$route.params.id
        this.getSelectedPostDetail(postId)
      },
      { immediate: true }
    )
  },
  watch:{
    'store.carDataLocation':{
      handler(newValue,oldValue){
        if(newValue){
          //this.store.carDataLocation = newValue
          console.log(this.store.carDataLocation)
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
