<template>
  <q-dialog
    v-model="this.store.notifyDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      bordered
      class="bg-dark"
      :style="{
        'width':this.store.mobileActive ? '100%' : '450px',
        'max-width':this.store.mobileActive ? '100%' : '450px'
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-card
          v-for="(data,key) in this.store.followsNotify" :key="key"
          class="bg-transparent text-white  " flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar v-on:Click="selectUser(data)">
                <q-btn icon="person" color="dark" round v-if="!data.userDetail.userImage"></q-btn>
                <img
                  v-if="data.userDetail.userImage"
                  style="object-fit:cover;"
                  :src="data.userDetail.userImage">
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-capitalize">
              <q-item-label class="text-overline">
                <!-- <q-icon name="mail"></q-icon> -->
                {{ data.userDetail.email ?? data.userDetail.name }}
              </q-item-label>
              <q-item-label caption class="text-white">
                <!-- <q-icon name="work"></q-icon> -->
                {{
                  data.userDetail.job ?? 'No Info'
                }}
              </q-item-label>
              <q-item-label caption class="text-grey-5">
                {{ data.message ?? '' }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-btn icon="delete_forever" flat color="red-4" v-on:click="removeFromNotifies(data)"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
         <q-card
          v-for="(data,key) in this.offersNotifyList" :key="key"
          :class="this.checkConfirmedSaler(data) ? 'bg-green-4 text-white' : 'bg-transparent text-white'"
          flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar v-on:Click="selectUser(data)">
                <q-btn icon="person" color="dark" round v-if="!data.userDetail.userImage"></q-btn>
                <img
                  v-if="data.userDetail.userImage"
                  style="object-fit:cover;"
                  :src="data.userDetail.userImage">
              </q-avatar>
            </q-item-section>
            <q-item-section class="text-capitalize">
              <q-item-label class="text-overline" v-on:click="console.log(data)">
                {{ data.userDetail.email ?? data.userDetail.name }}
              </q-item-label>
              <q-item-label caption class="text-white">
                {{
                  data.userDetail.job ?? 'No Info'
                }}
              </q-item-label>
              <q-item-label caption :class="this.checkConfirmedSaler(data) ? 'text-white' : 'text-grey-5'">
                {{ data.message ?? '' }}, {{ data.notifyDetail.price ?? 0 }}
              </q-item-label>
              <q-item-label caption class="text-white" v-if="this.checkUpdatedOrNot(data)">
                <q-icon name="info"></q-icon>
                {{ this.checkUpdatedOrNot(data) ? 'Updated Price From User' : '' }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-btn
                :icon="this.checkConfirmedSaler(data) ? 'remove' : 'check'"
                flat
                :color="this.checkConfirmedSaler(data) ? 'white' : 'green-4'"
                v-on:click="confirmPriceAndChangeConfirmedSaler(data)"></q-btn>
              <q-btn
                v-if="!this.checkConfirmedSaler(data)"
                icon="delete_forever" flat color="red-4" v-on:click="removeFromOfferNotifies(data)"></q-btn>
            </q-item-section>
          </q-item>
        </q-card>
        <q-card
          flat
          v-for="(data,key) in this.store.postNotify" :key="key"
          class="bg-transparent text-white q-pa-sm"
        >
          <q-card-section horizontal>
            <q-item-section class="col-2">
              <q-btn icon="info" flat color="white"></q-btn>
            </q-item-section>
            <q-item-section class="col text-subtitle2">
              <div class="text-overline">
                <q-icon name="person"></q-icon>
                {{ data.userDetail.email ?? data.userDetail.name }}
              </div>
              <div class="text-overline">
                <q-icon name="info"></q-icon>
                {{ data.message ?? '' }}
              </div>
            </q-item-section>
            <q-item-section class="col-2">
              <q-btn icon="delete_forever" flat color="red-4" v-on:click="deletePostNotify(data)"></q-btn>
            </q-item-section>
          </q-card-section>
        </q-card>
        <q-card
          flat
          v-for="(data,key) in this.store.declinedsNotify" :key="key"
          class="bg-transparent text-white q-pa-sm"
        >
          <q-card-section horizontal>
            <q-item-section class="col-2">
              <q-btn icon="info" flat color="white"></q-btn>
            </q-item-section>
            <q-item-section class="col text-subtitle2">
              <div class="text-overline">
                <q-icon name="person"></q-icon>
                {{ data.userDetail.email ?? data.userDetail.name }}
              </div>
              <div class="text-overline">
                <q-icon name="info"></q-icon>
                {{ data.notifyDetail.message ?? '' }}
              </div>
            </q-item-section>
            <q-item-section class="col-2">
              <q-btn icon="delete_forever" flat color="red-4" v-on:click="deteleDeclinedNotify(data)"></q-btn>
            </q-item-section>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section v-if="!this.offersNotifyList.length && !this.store.postNotify.length && !this.store.followsNotify.length">
        <q-card flat class="bg-transparent text-white">
          <q-card-section class="text-overline">
            <q-icon name="info"></q-icon>
            There is NO Any Kind Notify...
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <userDetailPluginVue v-if="this.store.selecteUserProfileCompActive"/>
  </q-dialog>
</template>

<script>
import { io } from "socket.io-client";
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import userDetailPluginVue from 'src/profilePlugin/userDetailPlugin.vue'
export default {
  components:{
    userDetailPluginVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      offersNotifyList:[]
    }
  },
  methods:{
    deteleDeclinedNotify(data){
      console.log(data)
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.notifyDetail.notifyId}/removeDeclinedNotify`)
        .then(res=>{
          console.log(res)
          if(res.data.removed && res.data.removed === true){
            this.store.declinedsNotify = this.store.declinedsNotify.filter(object => object.notifyDetail.notifyId !== data.notifyDetail.notifyId)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    deletePostNotify(data){
      const allBody = data
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removePostNotify`,allBody)
        .then(res=>{
          console.log(res)
          if(res.data.removed && res.data.removed === true){
            this.store.postNotify = this.store.postNotify.filter(object => object.notifyDetail.postId !== data.notifyDetail.postId)
          }else{
            //
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkUpdatedOrNot(data){
      if(data.notifyDetail.updated){
        return true
      }else{
        return false
      }
    },
    checkConfirmedSaler(data){
      if(data.postDetail.confirmedSaleUser){
        if(data.postDetail.confirmedSaleUser === data.userDetail._id){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    confirmPriceAndChangeConfirmedSaler(data){
      console.log(data)
      const postData = {
        notifyDetail:data.notifyDetail,
        allData:data
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.userDetail._id}/${data.notifyDetail.postId}/addConfirmSaler`,postData)
        .then(res=>{
          console.log(res)
           if(res.data.selectedCarSchema.confirmedSaleUser === '' || res.data.selectedCarSchema.confirmedSaleUser === null){
            data.postDetail.confirmedSaleUser = ''
          }else{
            data.postDetail.confirmedSaleUser = data.userDetail._id
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    removeFromOfferNotifies(data){
      console.log(data)
      const allBody = {
        allData:data
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.notifyDetail.notifyId}/removeFromOfferNotifies`, allBody)
        .then(res=>{
          if(res.data.removed === true){
            this.offersNotifyList = this.offersNotifyList.filter(object => object.notifyDetail.notifyId !== data.notifyDetail.notifyId)
          }
        })
    },
    getOfferedNotifies(id){
      axios.get(`${this.store.baseUrl}/carapp/${id}/getOfferedNotifies`)
        .then(res=>{
          console.log(res)
          this.offersNotifyList = res.data.offersNotify
        })
        .catch(err=>{
          console.log(err)
        })
    },
    selectUser(data){
      this.store.selecteUserProfile._id = data.userDetail._id
      this.store.selecteUserProfileCompActive =! this.store.selecteUserProfileCompActive
    },
    removeFromNotifies(data){
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.notifyId}/removeFromFollowsNotify`)
        .then(res=>{
          console.log(res)
          this.store.followsNotify = this.store.followsNotify.filter(object => object.notifyId !== data.notifyId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goBack(){
      this.store.notifyDialogActive =! this.store.notifyDialogActive
    }
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          const id = newValue._id
          if(id !== '' && id !== null){
            this.store.getMyNotifies(id)
            this.getOfferedNotifies(id)
          }
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
