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
          v-for="(data,key) in this.myofferedposts" :key="key"
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
              <q-btn icon="login" flat color="blue-4" v-on:Click="goSalePost(data)"></q-btn>
            </q-item-section>
          </q-item>
          <q-separator size="1px" color="grey-7"></q-separator>
          <q-card-section class="row">
            <q-card-section
              :class="data.confirmed === true ? 'bg-green-4 text-white' : ''"
              class="col text-center">
              My Price :
            </q-card-section>
            <q-card-section class="col text-center">
              {{ data.priceDetail.price ?? 0 }} $
            </q-card-section>
          </q-card-section>
          <q-card-section class="text-right">
            <q-icon name="event"></q-icon>
            {{ data.priceDetail.date ?? 'No Date' }}
          </q-card-section>
          <q-card-section class="text-left">
            <q-btn icon="delete_forever" color="red-4" no-caps label="Cancel My Offer" v-on:click="removeMyPendingOffer(data)"></q-btn>
            <q-btn icon="edit" color="blue-4" label="Update Offer Price" no-caps class="q-ml-sm" v-on:click="updateOfferPrice(data)"></q-btn>
          </q-card-section>
        </q-card>
      </q-scroll-area>
    </q-card-section>
    <offerPriceVue
        @updatependingoffers="getupdatependingoffers"
        :currentPost="this.currentPost"
        v-if="this.store.offerPriceCompActive"
      />
  </q-card>
</template>

<script>
import offerPriceVue from '../offer/offerPrice.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
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
      myofferedposts:[],
      currentPost:{}
    }
  },
  methods:{
    goSalePost(data){
      this.$router.push(`/detailCarSalePost/${data.postDetail.postId}`)
    },
    removeOfferedPrice(data){
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postDetail.postId}/removeMyOffer`)
        .then(res=>{
          if(res.data.removed && res.data.removed === true){
            this.myofferedposts = this.myofferedposts.filter(object => object.postDetail.postId !== data.postDetail.postId)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getupdatependingoffers(data){
      if(data){
        const result = this.myofferedposts.find(object => object.postDetail.postId === data.selectedPost.postId)
        if(result){
          console.log('getupdatependingoffers',result)
          console.log('getupdatependingoffersdata',data)
          result.priceDetail = data.result
        }
      }
    },
    updateOfferPrice(data){
      console.log(data)
      this.currentPost = data.postDetail
      this.store.offerPriceCompActive =! this.store.offerPriceCompActive
    },
    removeMyPendingOffer(data){
      this.$q.dialog({
        cancel:true,
        title:'Warning',
        message:'Are You Sure For Cancel Pending Offer ?'
      }).onOk(() => {
        this.removeOfferedPrice(data)
      })
    },
    getMyPendingOffersNotify(id){
      axios.get(`${this.store.baseUrl}/carapp/${id}/getOnlyPendingOffers`)
        .then(res=>{
          console.log(res)
          this.myofferedposts = res.data.myofferedposts
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
          this.getMyPendingOffersNotify(id)
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
