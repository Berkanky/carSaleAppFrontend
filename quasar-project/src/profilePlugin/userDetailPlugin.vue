<template>
  <q-dialog
    v-model="this.store.selecteUserProfileCompActive"
    :maximized="this.store.mobileActive ? true : false"
    :full-height="this.store.mobileActive ? true : false"
    persistent
  >
    <q-card
      :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
    >
      <q-card-section class="text-left">
        <q-btn icon="cancel" flat color="grey-7" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-separator color="grey-4" size="2px"></q-separator>
      <q-card-section class="text-center">
        <q-avatar size="200px">
          <q-btn v-if="!this.store.selecteUserProfile.userImage" icon="person" color="dark" round></q-btn>
          <img
            v-if="this.store.selecteUserProfile.userImage"
            style="object-fit:cover;"
            :src="this.store.selecteUserProfile.userImage" alt="">
        </q-avatar>
      </q-card-section>
      <q-card-section class="text-center">
        <div class="text-overline">
          <q-icon name="mail" color="grey-5"></q-icon>
          {{ this.store.selecteUserProfile.email ?? this.store.selecteUserProfile.name }}
        </div>
        <div class="text-caption text-weight-bold text-grey-5">
          <q-icon name="location_on" color="grey-5"></q-icon>
          {{ this.store.selecteUserProfile.locationDetails ? this.store.selecteUserProfile.locationDetails.fullAddress : '' }}
        </div>
        <div class="text-capitalize text-grey-6 text-weight-bold">
          <q-icon name="work" color="grey-5"></q-icon>
          {{ this.store.selecteUserProfile.job ?? 'No Job Info' }}
        </div>
      </q-card-section>
      <q-separator color="grey-4" size="2px"></q-separator>
      <q-card-section class="text-center">
        <q-btn icon="mail" color="green-4" v-on:click="emailDialogActiveButton"></q-btn>
        <q-btn icon="list" color="blue-4"></q-btn>
        <q-btn
          :flat="this.checkUserFollowingOrNot() ? true : false"
          icon="favorite"
          color="red-4"
          v-on:click="addToFollowList"></q-btn>
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="this.emailDialogActive"
      :maximized="this.store.mobileActive ? true : false"
      :full-height="this.store.mobileActive ? true : false"
      persistent
    >
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '500px',
        'max-width':this.store.mobileActive ? '100%' : '500px'
      }"
    >
      <q-card-section class="text-left">
        <q-btn icon="cancel" flat color="grey-7" v-on:click="closeMessage"></q-btn>
      </q-card-section>
      <q-separator color="grey-4" size="2px"></q-separator>
      <q-card-section class="text-center">
        <q-input
          color="dark"
          readonly
          filled :label="this.store.selecteUserProfile.email"
        >
          <template v-slot:prepend>
            <q-icon name="mail"></q-icon>
          </template>
        </q-input>
        <q-input
          class="q-mt-sm"
          color="dark"
          v-model="this.messageData.subject"
          filled label="Enter Mail Subject"
        >
          <template v-slot:prepend>
            <q-icon name="subject"></q-icon>
          </template>
          <template v-slot:append v-if="this.messageData.subject">
            <q-btn icon="remove" color="dark" size="sm" v-on:click="this.messageData.subject = ''"></q-btn>
          </template>
        </q-input>
        <q-input
        class="q-mt-sm"
        filled
        color="dark"
        type="textarea"
        label="Enter Message"
        v-model="this.messageData.message"
        >
          <template v-slot:prepend>
            <q-icon name="chat"></q-icon>
          </template>
          <template v-slot:append v-if="this.messageData.message">
            <q-btn icon="remove" color="dark" size="sm" v-on:click="this.messageData.message = ''"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-separator color="grey-4" size="2px"></q-separator>
      <q-card-section class="text-right" v-if="this.checkMessageData()">
        <q-btn icon="clear_all" color="red-4" label="Clear" v-on:click="clearAll"></q-btn>
        <q-btn icon="send" color="green-4" label="Send" v-on:click="sendMail"></q-btn>
      </q-card-section>
    </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store  = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      emailDialogActive:false,
      messageData:{},
      followList:[]
    }
  },
  methods:{
    checkUserFollowingOrNot(){
      const result = this.followList.some(object => object.userId === this.store.selecteUserProfile._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    addToFollowList(){
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.store.selecteUserProfile._id}/addMyFollowList`)
        .then(res=>{
          console.log(res)
          if(res.data.removed === true){
            this.followList = this.followList.filter(object => object.userId !== this.store.selecteUserProfile._id)

          }else{
            this.followList.push({userId : this.store.selecteUserProfile._id})
          }
          const sendData  = {
            selecteUserProfile:this.store.selecteUserProfile,
            followList:this.followList
          }
          this.$emit('followList',sendData)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    sendEmailFunction(){
      if(this.messageData.subject &&  this.messageData.message){
        const messageclone = {
          messageId:uuidv4(),
          senderId:this.store.userDetail._id,
          selectedUserId:this.store.selecteUserProfile._id,
          senderPhoneNumber:this.store.userDetail.communicationNumber ?? '',
          postId:'',
          subject:this.messageData.subject,
          message:this.messageData.message
        }
        const messageData = {
          messagePost:messageclone,
          senderUserDetail:this.store.userDetail,
        }
        axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.store.selecteUserProfile._id}/sendOnlyEmail`,messageData)
          .then(res=>{
            console.log(res)
            this.messageData = {}
            this.$q.notify({
              type:'positive',
              message:'Message Sended !',
              position:'right',
            })
            this.emailDialogActive =! this.emailDialogActive
          })
          .catch(err=>{
            console.log(err)
          })
      }
    },
    clearAll(){
      this.messageData = {}
    },
    sendMail(){
      this.sendEmailFunction()
    },
    checkMessageData(){
      for(let key in this.messageData){
        if(this.messageData[key] !== '' && this.messageData[key] !== null){
          return true
        }else{
          return false
        }
      }
    },
    closeMessage(){
      this.emailDialogActive = false
    },
    emailDialogActiveButton(){
      this.emailDialogActive =! this.emailDialogActive
    },
    getUserLocation(){

    },
    goBack(){
      this.store.selecteUserProfileCompActive = false
    }
  },
  created(){
    const watchSelectedUser = this.$watch('store.selecteUserProfile',(newValue)=>{
      if(newValue._id){
        const selectedUserDataId = newValue._id
        console.log('selectedUserData',selectedUserDataId)
        this.store.getSelectedUserDetail(selectedUserDataId)
      }
    }, { immediate: true })
    watchSelectedUser()


    const watchMyUser = this.$watch('store.userDetail',(newValue) =>{
      if(newValue._id){
        const id = newValue._id
        console.log('id',id)
        this.store.getMyFolLists(id)
      }
    }, {immediate : true})
    watchMyUser()
  },
  watch:{
    'store.myAllFolLists':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.followList = newValue.followList
          console.log('followList',this.followList)
        }
      },
      immediate:true,
      deep:true
    }
/*     'store.selecteUserProfile':{
      handler(newValue,oldValue){
        if(newValue._id){
          const selectedUserDataId = newValue._id
          console.log('selectedUserData',selectedUserDataId)
          this.store.getSelectedUserDetail(selectedUserDataId)
        }
      },
      immediate:true
    } */
  }
}
</script>

<style>

</style>
