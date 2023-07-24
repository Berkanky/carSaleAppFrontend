<template>
  <q-dialog
    v-model="this.store.offerPriceCompActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '550px',
        'max-width':this.store.mobileActive ? '100%' : '550px'
      }"
    >
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input type="number" filled color="dark" label="Enter Price Offer" v-model="this.priceData.price">
          <template v-slot:prepend>
            <q-icon name="sell"></q-icon>
          </template>
          <template v-slot:append v-if="this.priceData.price">
            <q-btn icon="remove" color="dark" size="sm" v-on:Click="this.priceData.price = ''"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="text-right">
        <q-btn
          v-on:click="sendOfferPrice"
          no-caps label="Offer"
          color="green-4"
          :disable="this.priceData.price ? false : true"
          icon="send"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import {useCounterStore} from '../stores/store'
export default {
  props:['currentPost'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      priceData:{},
      postDetail:{}
    }
  },
  methods:{
    sendOfferPrice(){
      if(this.priceData.price){
        const priceData = {
          price:this.priceData.price ?? 0,
          userId:this.store.userDetail._id,
        }
        console.log(priceData)

        axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.postDetail.postId}/addOfferedPrice`, priceData)
          .then(res=>{
            console.log(res)
            this.priceData = {}

            //pendingOffers.vue için update
            if(this.store.selectedProfileOption.value === 'showmypendingoffers' || this.store.selectedProfileOption.value === 'showmydeclinedoffers'){
              const updatedData = {
                selectedPost:res.data.selectedPost,
                result:res.data.result
              }

              this.$emit('updatependingoffers',updatedData)
            }
          })
          .catch(err=>{
            console.log(err)
          })
      }
    },
    goBack(){
      this.store.offerPriceCompActive =! this.store.offerPriceCompActive
    }
  },
  created(){

  },
  watch:{
    currentPost:{
      handler(newValue,oldValue){
        if(newValue.postId){
          this.postDetail = newValue
          console.log('postDetail',this.postDetail)
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
