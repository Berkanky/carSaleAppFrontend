<template>
      <q-card
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '700px',
        'max-width':this.store.mobileActive  ? '100%' : '700px',
        'height':this.$q.screen.height + 'px'
      }"
      bordered dark
      class="text-white">
      <q-card-section>
        <q-card
          :style="{
            'height':this.store.mobileActive ? '100%' : '250px'
          }"
          v-for="(data,key) in this.store.allConfirmedCarSalePosts" :key="key"
          class="bg-transparent" bordered>
          <q-card-section horizontal>
            <q-img
              :style="{
                'height':this.store.mobileActive ? '100%' : '250px'
              }"
              style="object-fit:cover;"
              class="col"
              :src="data.mainImage"
              v-if="data.mainImage"
            >
              <div class="absolute-bottom text-white">
                {{ data.title ?? '' }}
              </div>
            </q-img>
              <q-card-actions vertical class="justify-around q-px-md">
                <q-btn flat round color="red-4" icon="delete_forever" v-on:click="cancelConfirmed(data)"/>
                <q-btn flat round color="green-4" icon="login" />
                <q-btn flat round color="white" icon="info" v-on:click="showDetail(data)"></q-btn>
              </q-card-actions>
            </q-card-section>
          </q-card>
          <q-card
            class="bg-transparent text-white" flat
            v-if="!this.store.allConfirmedCarSalePosts.length"
          >
            <q-card-section class="text-subtitle2">
              <q-icon name="info"></q-icon>
              No Any Confirmed !..
            </q-card-section>
          </q-card>
      </q-card-section>
      <q-dialog
        v-model="this.detailActive"
        :maximized="this.store.mobileActive ? true : false"
        :full-height="this.store.mobileActive ? true : false"
        persistent
        :position="this.store.mobileActive ? 'center' : 'left'"
      >
        <q-card
          class="bg-dark text-white" flat
          :style="{
            'width':this.store.mobileActive ? '100%' : '450px',
            'max-width':this.store.mobileActive ? '100%' : '450px'
          }"
        >
          <q-card-section>
            <q-btn icon="remove" flat color="white" v-on:click="this.detailActive =! this.detailActive; this.offeredPriceDetail = {}"></q-btn>
          </q-card-section>
          <q-card-section horizontal class="text-subtitle2 text-center">
            <q-card-section class="col">
              <q-icon name="info"></q-icon>
              Price :
            </q-card-section>
            <q-card-section class="col text-white bg-green-4">
              {{ this.offeredPriceDetail.price ?? 'No Info' }}
              <q-icon name="attach_money"></q-icon>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      detailActive:false,
      offeredPriceDetail:{}
    }
  },
  methods:{
    showDetail(data){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/getMoreDetailConfirmedPrice`)
        .then(res=>{
          console.log(res)
          this.offeredPriceDetail =  res.data.detailOfferedPrice
          this.detailActive =! this.detailActive
        })
        .catch(err=>{
          console.log(err)
        })
    },
    cancelConfirmed(data){
      const selectedPost = data
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/cancelConfirmed`,selectedPost)
        .then(res=>{
          console.log(res)
          if(res.data.removed && res.data.removed === true){
            this.store.allConfirmedCarSalePosts = this.store.allConfirmedCarSalePosts.filter(object => {
              object.postId !== data.postId
            })
          }
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
          this.store.getMyConfirmedPosts(id)
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
