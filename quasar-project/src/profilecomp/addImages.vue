<template>
  <q-dialog
    v-model="this.store.profileImageCompActive"
    persistent dark
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >
    <q-card 
      :style="{
        'width':this.store.mobileActive ? '100%' : '700px',
        'max-width':this.store.mobileActive ? '100%' : '700px'
      }"
      class="bg-dark text-white">
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <upload @currentImageData="getcurrentImageData"/>
      </q-card-section>
      <q-card-section>
        <div class="text-overline text-capitalize text-grey-5">
          <q-icon name="info" size="17px"></q-icon>
          To set a photo as a profile picture, press and hold the photo.
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-card 
          dark bordered
          class="col-12 col-md-4 col-sm-4" style="height:150px;" v-for="(data,key) in this.myImages" :key="key">
          <q-img 
            loading="lazy"
            spinner-color="white"
            :src="data.image" style="object-fit:Cover;height:100%;"  v-touch-hold:2000.mouse="event => changeProfilePic(data)">
            <div class="absolute-top-right bg-transparent">
              <q-btn icon="remove" color="dark" size="sm" round v-on:click="removeFromDb(data)"></q-btn>
            </div>
          </q-img>
        </q-card>
        <q-card 
          dark bordered
          class="col-12 col-md-4 col-sm-4" style="height:150px;" v-for="(data,key) in this.selectedImages" :key="key">
          <q-img 
            loading="lazy"
            spinner-color="white"
            :src="data.image" style="object-fit:Cover;height:100%;">
            <div class="absolute-top-right bg-transparent">
              <q-btn icon="remove" color="dark" size="sm" round  v-on:click="removeImage(data)"></q-btn>
            </div>
          </q-img>
        </q-card>
        <q-card v-if="this.selectedImages.length" class="bg-dark col-12 col-md-4 col-sm-4" style="height:150px;">
          <q-btn icon="add" flat color="green" class="full-width full-height" v-on:click="addImagesToDb"></q-btn>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import upload from 'src/components/upload.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    upload
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      myImages:[],
      selectedImages:[],
      selectedImage:{},
      currentLocation:{}
    }
  },
  methods:{
    changeProfilePic(data){
      console.log(data)
      const selectedImage = data
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeProfilePic`,selectedImage)
        .then(res=>{
          console.log(res)
          this.store.userDetail = res.data.myacc
        })
        .catch(err=>{
          console.log(err)
        })
    },
    removeFromDb(data){
      axios.delete(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data._id}/removeFromUserImages`)
        .then(res=>{
          console.log(res)
          this.store.userDetail.userImages = this.store.userDetail.userImages.filter(object=> object._id !== data._id)
          this.getMyImages()
        })
        .catch(err=>{
          console.log(err)
        })
    },
    addImagesToDb(){
      const selectedImages = this.selectedImages
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/addImages`,[selectedImages])
        .then(res=>{
          console.log(res)
          this.selectedImages = []
          this.store.userDetail = res.data
          this.getMyImages()
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyImages(){
      console.log(this.store.userDetail)
      this.myImages = this.store.userDetail.userImages
    },
    removeImage(data){
      this.selectedImages = this.selectedImages.filter(object => object.id !== data.id)
    },
    goBack(){
      this.store.profileImageCompActive = false
    },
    getcurrentImageData(data){
      if(data){
        console.log(data)
        this.selectedImages.push(data)
      }
    }
  },
  created(){
    this.getMyImages()
  },
  watch:{

  }
}
</script>

<style>

</style>