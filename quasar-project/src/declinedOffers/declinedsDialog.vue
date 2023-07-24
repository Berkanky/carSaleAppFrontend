<template>
  <q-card
    class="bg-dark text-white" bordered
    style="margin:0 auto;"
    :style="{
      'width':this.store.mobileActive ? '100%'  : '700px',
      'height':this.$q.screen.height + 'px'
    }"
  >
    <q-card-section>
      <q-scroll-area
        :style="{
            'max-width':'100%',
            'height':(this.$q.screen.height - 50) + 'px'
          }"
      >
        <q-card
          dark
          v-for="(data,key) in this.declinedsNotify" :key="key"
          class="text-dark q-mt-sm text-white" bordered>
          <q-item horizontal>
            <q-item-section avatar class="col">
              <q-avatar>
                <img :src="data.postDetail.mainImage" style="object-fit:cover;" v-if="data.postDetail.mainImage">
                <q-btn icon="groups" round color="dark" v-if="!data.postDetail.mainImage"></q-btn>
              </q-avatar>
            </q-item-section>
            <q-item-section class="col-6">
              <q-item-label>{{data.postDetail.title ?? 'No Title'}}</q-item-label>
              <q-item-label caption class="text-white">
                {{ data.postDetail.extras ?? 'NO Extra' }}
              </q-item-label>
            </q-item-section>
            <q-space></q-space>
            <q-item-section class="text-right col">
              <q-btn
                v-if="data.userDetail._id"
                icon="login" flat color="blue-4" v-on:click="goSalePost(data)"></q-btn>
            </q-item-section>
          </q-item>
          <q-separator size="1px" color="grey-7"></q-separator>
          <q-card-section class="text-center">
            <q-icon name="info"></q-icon>
            {{ data.notifyDetail.message ?? 'No Message' }}
          </q-card-section>
          <q-card-section class="row">
            <q-card-section class="col text-center">
              <q-icon name="info"></q-icon>
              Offered Price :
            </q-card-section>
            <q-card-section class="col text-center">
              {{ data.notifyDetail.price ?? 'No Info About Price' }} $
            </q-card-section>
          </q-card-section>
          <q-card-section class="text-right">
            <q-icon name="event"></q-icon>
            {{ data.notifyDetail.date ?? 'No Date' }}
          </q-card-section>
          <q-card-section class="text-right">
            <q-icon name="info"></q-icon>
            Try Offer Price Again <q-btn icon="edit" flat color="blue-4" v-on:click="upateOfferrPrice(data)" v-if="data.userDetail._id"></q-btn>
          </q-card-section>
          <q-card-section class="text-left">
            <q-btn
              v-if="data.userDetail._id"
              icon="delete_forever" color="red-4"
              no-caps label="Remove" v-on:click="deleteNotify(data)"></q-btn>
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-card-section>
    <offerPriceVue
      :currentPost="this.currentPost"
      @updatependingoffers="getupdatependingoffers"
      v-if="this.store.offerPriceCompActive"/>
  </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import offerPriceVue from 'src/offer/offerPrice.vue'
export default {
  components:{
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
      declinedsNotify:[],
      currentPost:{}
    }
  },
  methods:{
    getupdatependingoffers(data){
      if(data){
/*         const findpost = this.declinedsNotify.find(object => object.postDetail.postId === data.selectedPost.postId)
        if(findpost){
          findpost.notifyDetail.price = data.result.price
        } */

        this.declinedsNotify = this.declinedsNotify.filter(object => object.postDetail.postId !==  data.selectedPost.postId)
        if(!this.declinedsNotify.length){
          this.declinedsNotify.push({userDetail:{},postDetail:{},notifyDetail:{message:'No Info'}})
        }
      }
    },
    upateOfferrPrice(data){
      this.currentPost = data.postDetail
      const check = this.currentPost.postId ? true : false
      if(check){
        this.store.offerPriceCompActive =! this.store.offerPriceCompActive
        console.log(this.currentPost)
      }
    },
    goSalePost(data){
      this.$router.push(`/detailCarSalePost/${data.postDetail.postId}`)
    },
    deleteNotify(data){
      const allBody = {
        selectedData:data
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeFromDeclinedsNotify`,allBody)
        .then(res=>{
          console.log(res)
          if(res.data.removed && res.data.removed === true){
            this.declinedsNotify = this.declinedsNotify.filter(object => object.notifyDetail.notifyId !== data.notifyDetail.notifyId)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyDeclinedOffers(id){
      axios.get(`${this.store.baseUrl}/carapp/${id}/getDeclinedOffers`)
        .then(res=>{
          console.log(res)
          this.declinedsNotify = res.data.declinedsNotify
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          const id = newValue._id
          this.getMyDeclinedOffers(id)
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
