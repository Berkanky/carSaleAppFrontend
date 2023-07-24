<template>
  <q-card
    class="bg-grey-3 text-dark">
    <q-card-section class="text-center">
      <div class="text-subtitle2 text-grey-8 text-weight-bold text-left q-pa-md">
        <q-icon name="edit"></q-icon>
        Create Car Sale Post
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
          <q-card style="height:250px;">
            <q-img :src="this.mainImage.image ?? 'https://cdn.quasar.dev/img/mountains.jpg'" style="object-fit:cover;height:100%;"></q-img>
          </q-card>
        </q-card-section>
        <q-card-section class="row">
          <q-card
            v-on:click="makeMainImage(data)"
            v-for="(data,key) in this.selectedImages" :key="key"
            class="col-12 col-md-4 col-sm-4" style="height:150px;">
            <q-img style="height:100%;object-fit:cover;" :src="data.image">
              <div class="absolute-top-right bg-transparent">
                <q-btn icon="remove" color="dark" round v-on:click="removeFromList(data)" size="sm"></q-btn>
              </div>
            </q-img>
          </q-card>
        </q-card-section>
        <q-card-section class="q-mt-xs row">
      <q-select
        :options="this.conditionOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled label="Condition" v-model="this.carData.condition" color="dark">
      </q-select>
      <q-input
        type="number"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled label="Kilometres" v-model="this.carData.kilometres" color="dark">

      </q-input>
      <q-select
        :options="this.transmissionOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled label="Transmission" v-model="this.carData.transmission" color="dark">
      </q-select>
      <q-select
        :options="this.fuelTypeOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled label="Fuel Type" v-model="this.carData.fuelType" color="dark">
      </q-select>
      <q-input
        type="text"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled label="Trim" v-model="this.carData.trim" color="dark">
      </q-input>
      <q-select
        :options="this.bodyOption"
        class="col-12 col-md-6 col-sm-6 q-pa-xs" filled label="Body Type" v-model="this.carData.bodyType" color="dark">
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
          filled :label="this.carData.cylinders ?? 'Select Cylinder'"
          v-model="this.carData.cylinders" class="col-12 col-md-6 col-sm-6 q-pa-xs" color="dark"
          :options="this.store.cylindersOptions"
        ></q-select>
        <q-select
          filled :label="this.carData.engineSize ?? 'Select Engine Size'"
          v-model="this.carData.engineSize" class="col-12 col-md-6 col-sm-6 q-pa-xs" color="dark"
          :options="this.store.engineSizeOptions"
        ></q-select>
        <q-select
          filled :label="this.carData.doors ?? 'Select Door Type'"
          v-model="this.carData.doors" class="col-12 col-md-6 col-sm-6 q-mt-xs q-pa-xs" color="dark"
          :options="this.store.doorOptions"
        ></q-select>
        <q-select
          filled :label="this.carData.driveTrain ?? 'Select Drive Train Type'"
          v-model="this.carData.driveTrain" class="col-12 col-md-6 col-sm-6 q-mt-xs q-pa-xs" color="dark"
          :options="this.store.driveTrainOptions"
        ></q-select>
        <q-input
          type="textarea"
          class="col-12 q-mt-xs"
          filled color="dark"
          :label="this.carData.extras ?? 'Enter Extras'"
          v-model="this.carData.extras"
        ></q-input>
    </q-card-section>
      </q-card-section>
      <q-card-section class="col col-md col-sm">
        <q-input
          type="text"
          v-model="this.carData.title"
          filled color="dark" label="Enter the Ad Title">
          <template v-slot:prepend>
            <q-icon name="title"></q-icon>
          </template>
        </q-input>
        <q-input
          type="textarea" v-model="this.carData.description"
          filled color="dark" label="Enter Description" class="q-mt-xs">
          <template v-slot:prepend>
            <q-icon name="info"></q-icon>
          </template>
        </q-input>
        <q-card-section horizontal class="q-mt-sm">
          <q-btn-dropdown color="dark" label="Select Brand" icon="info" no-caps class="col-12 col-md-6 col-sm-6">
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
            label="Select Car Model" color="dark" class="col-12 col-md-6 col-sm-6">
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
            type="number" label="Enter Price" class="col-12 col-md-6 col-sm-6" filled color="dark">
              <template v-slot:prepend>
                <q-icon name="currency_lira"></q-icon>
              </template>
            </q-input>
            <q-input
              v-model="this.carData.year"
            type="number" label="Enter Year" class="col-12 col-md-6 col-sm-6" filled color="dark">
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
            :label="this.store.carDataLocation.country ?? ''"
            class="col-12 col-md-6 col-sm-6" filled color="dark"
            readonly
            >
              <template v-slot:prepend>
                <q-icon name="flag"></q-icon>
              </template>
            </q-input>
            <q-input
            :label="this.store.carDataLocation.city ?? ''"
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
            :label="this.store.carDataLocation.fullAddress ?? ''"
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
      <q-btn icon="clear_all" color="red" v-on:click="removeAll"></q-btn>
      <q-btn icon="send" color="green" v-on:click="createPost"></q-btn>
    </q-card-section>
    <colorOptionComp v-if="this.store.colorCompActive" @carDataColor="getcarDataColor"/>
  </q-card>
</template>

<script>
import colorOptionComp from './colorOptionComp.vue';
import { v4 as uuidv4 } from 'uuid';
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
      selectedImages:[],
      mainImage:{},
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
      ]
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
    removeAll(){
      this.carData = {}
      this.mainImage = {}
      this.selectedImages = []
      this.store.carDataLocation = {}
    },
    addmyposts(){
      this.carData.userDetail = this.store.userDetail._id
      const postData = {
        carData:this.carData,
        selectedImages:this.selectedImages,
        carDataLocation:this.store.carDataLocation
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/addMyPosts`,postData)
        .then(res=>{
          console.log(res)
          this.removeAll()
        })
        .catch(err=>{
          console.log(err)
        })
    },
    createPost(){
      console.log(this.carData)
      console.log(this.selectedImages)
      console.log(this.mainImage)
      this.carData.userDetail = this.store.userDetail._id
      this.carData.postId = uuidv4()
      const postData = {
        carData:this.carData,
        selectedImages:this.selectedImages,
        carDataLocation:this.store.carDataLocation
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/postCarSale`,postData)
        .then(res=>{
          console.log(res)

        })
        .catch(err=>{
          console.log(err)
        })
        this.addmyposts()
    },
    selectModel(data){
      this.carData.model = data.model
      console.log(this.carData)
    },
    async getModels(carData){
      const res = await fetch(`https://private-dc7d79-carsapi1.apiary-mock.com/cars`)
      const data = await res.json()
      console.log(data)
      const list = data.filter(object => object.make === carData.name)
      console.log(list)
      this.modelList = list
    },
    selectBrand(data){
      this.carData.brand = data.name
      console.log(this.carData)
      const carData = data
      console.log(carData)
      this.getModels(carData)
    },
    async getManufacturer(){
      const res = await fetch('https://private-dc7d79-carsapi1.apiary-mock.com/manufacturers')
      const data = await res.json()
      console.log(data)
      this.brandList = data
      console.log('brandlist',this.brandList)
    },
    makeMainImage(data){
      this.mainImage = data
      this.carData.mainImage = data.image
    },
    removeFromList(data){
      this.selectedImages = this.selectedImages.filter(object => object.id !== data.id)
    },
    getOnlySelectedImages(){
      if(this.selectedImages.length === 4){
        const list = []
        this.selectedImages.forEach(element => {
          list.push(element.image)
        });
        return list
      }
    },
    getcurrentImageData(data){
      if(data){
        if(this.selectedImages.length<5){
          this.selectedImages.push(data)
          this.mainImage = data
          this.carData.mainImage = data.image
        }
      }
    }
  },
  created(){
    this.getManufacturer()
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
