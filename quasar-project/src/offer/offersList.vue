<template>
  <q-dialog
    v-model="this.store.offersListDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card

      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '550px',
        'max-width':this.store.mobileActive ? '100%' : '550px'
      }"
    >
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="white"  v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-card
          class="bg-transparent text-white" bordered
          v-for="(data,key) in this.detailList" :key="key"
        >
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-avatar
              >
                <img
                  v-if="data.userDetail.userImage"
                  style="object-fit:cover;"
                  :src="data.userDetail.userImage"
                >
                <q-btn icon="person" color="dark" round v-if="!data.userDetail.userImage"></q-btn>
              </q-avatar>
            </q-card-section>
            <q-card-section class="col-6">
              <div class="text-subtitle2">
                <q-icon name="mail"></q-icon>
                {{ data.userDetail.email ?? data.userDetail.name }}
              </div>
              <div class="text-subtitle2 text-grey-5">
                <q-icon name="work"></q-icon>
                {{ data.userDetail.job ?? 'No Info' }}
              </div>
            </q-card-section>
            <q-card-section class="col" v-if="data.selectedPostId">
              <q-btn icon="remove" flat color="red" v-on:click="removeOfferedPrice(data)"></q-btn>
            </q-card-section>
          </q-card-section>
          <q-card-section class="row">
            <q-card-section
              :class="data.confirmedPrice === true ? 'bg-green-4' : ''"
              class="col text-center text-overline">
              Price :
              <div class="text-caption" v-if="data.confirmedPrice">
                <q-icon name="info"></q-icon>
                {{ data.confirmedPrice === true ? 'Confirmed Price' : '' }}
              </div>
              <div class="text-caption" v-if="data.confirmedPrice">
                <q-icon name="event"></q-icon>
                {{ data.confirmedPrice === true ? data.priceDetail.date ?? 'No Date Info' : '' }}
              </div>
            </q-card-section>
            <q-card-section class="col text-center text-overline">
              {{ data.priceDetail.price }} $
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from  '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedPost:{},
      detailList:[]
    }
  },
  methods:{
    removeOfferedPrice(data){
      console.log(data)
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.selectedPostId}/${data.priceDetail.userId}/removeFromOfferedPrices`)
        .then(res=>{
          if(res.data.removed && res.data.removed === true){
            this.detailList  = this.detailList.filter(object => object.priceDetail.userId !== data.priceDetail.userId)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goBack(){
      this.store.offersListDialogActive =! this.store.offersListDialogActive
    },
    selectedPostOfferedPricesDetail(params){
      const allBody = {
        selectedPost:params.body
      }
      axios.put(`${this.store.baseUrl}/carapp/${params.currentUserId}/${params.selectedPostId}/getOfferedPricesDetail`,allBody)
        .then(res=>{
          console.log(res)
          this.detailList = res.data.newList
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getSelectedPostDetail(postId){
      axios.get(`${this.store.baseUrl}/carapp/${postId}/getSelectedPostDetail`)
        .then(res=>{
          this.selectedPost = res.data.selectedpost
          console.log('selectedPost',this.selectedPost)
          const params = {
            currentUserId:this.store.userDetail._id,
            selectedPostId:res.data.selectedpost.postId,
            body:res.data.selectedpost
          }
          this.selectedPostOfferedPricesDetail(params)
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
          console.log('userdetail',newValue)
        }
      },
      immediate:true,
      deep:true
    },
    'store.forOfferedListSelectedSalePost':{
      handler(newValue,oldValue){
        if(newValue.postId){
          console.log('forOfferedListSelectedSalePost',this.store.forOfferedListSelectedSalePost)
          const postId = newValue.postId
          this.getSelectedPostDetail(postId)
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
