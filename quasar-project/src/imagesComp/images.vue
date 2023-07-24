<template>
  <q-dialog
    dark
    v-model="this.store.imagesCompActive"
    :full-height="true"
    :maximized="true"
    persistent
  >
    <q-card class="bg-dark">
      <Carousel id="gallery" :items-to-show="1" :wrap-around="false" v-model="this.currentSlide">
          <Slide v-for="(data,key) in this.imageList" :key="key">
            <q-img :src="data.image"></q-img>
          </Slide>
        </Carousel>
        <Carousel
          id="thumbnails"
          :items-to-show="4"
          :wrap-around="false"
          v-model="this.currentSlide"
          ref="carousel"
        >
          <Slide v-for="(data,key) in this.imageList" :key="key">
            <q-img :src="data.image" v-on:click="nextSlide(data)"></q-img>
          </Slide>
        </Carousel>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import { Carousel, Slide  } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import {useCounterStore} from '../stores/store'
export default {
  props:['currentPost'],
  components:{
    Carousel, Slide
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      imageList:[],
      mainImage:'',
      currentSlide:0,
      keyPressed:''
    }
  },
  methods:{
    handleKeyDown(event){
      this.keyPressed = event.key;
    },
    nextSlide(val){
      this.currentSlide = this.currentSlide + 1
    },
    goBack(){
      this.store.imagesCompActive = false
    },
    getImages(newData){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${newData.postId}/getSelectedPostImages`)
        .then(res=>{
          console.log(res)
          this.imageList = res.data.imageList
          this.mainImage = res.data.mainImage ?? ''
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  },
  created(){

  },
  watch:{
    keyPressed(newValue) {
      if (newValue === 'Escape') {
        // Esc key was pressed
        console.log('Esc key pressed!');
        this.store.imagesCompActive = false
      }
    },
    currentPost:{
      handler(newValue,oldValue){
        if(newValue != '' && newValue != null){
          const newData = newValue
          this.getImages(newData)
        }
      },
      immediate:true,
      deep:true
    },
    'store.imagesCompActive':{
      handler(newValue,oldValue){
        if(newValue === true){

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
