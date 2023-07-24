<template>

  <q-dialog
    v-model="this.store.sharedsDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '500px',
        'max-width':this.store.mobileActive ? '100%' : '500px'
      }"
    >
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="this.userData.email"
          v-on:keyup.enter="getUser"
          filled color="dark" label="Find User"
        >
          <template v-slot:prepend>
            <q-icon name="person"></q-icon>
          </template>
          <template v-slot:append v-if="this.userData.email">
            <q-btn icon="remove" size="sm" color="dark" v-on:click="clearAll"></q-btn>
          </template>
        </q-input>
        <q-list bordered separator>
          <q-item
            v-on:click="selectEmail(data)"
            v-for="(data,key) in this.findedUsers" :key="key"
            clickable v-ripple>
            <q-item-section avatar>
              <q-avatar>
                <img
                  style="object-fit:Cover;"
                  :src="data.userImage" v-if="data.userImage">
                <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
              </q-avatar>
            </q-item-section>
            <q-item-section>{{data.email ?? ''}}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section
        v-if="this.selectedUser._id"
      >
        <q-card

          class="" bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img
                  style="object-fit:cover;"
                  v-if="this.selectedUser.userImage"
                  :src="this.selectedUser.userImage">
                <q-btn icon="person" color="dark" round v-if="!this.selectedUser.userImage"></q-btn>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{this.selectedUser.name ?? this.selectedUser.email}}</q-item-label>
              <q-item-label caption>
                <q-icon name="work"></q-icon>
                {{this.selectedUser.job ?? 'No Info'}}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs col">
                <div class="text-overline">{{this.localCurrentPost.brand ?? ''}}</div>
                <div class="text-h5 q-mt-sm q-mb-xs">{{this.localCurrentPost.title ?? ''}}</div>
                <div class="text-caption text-grey-6 text-weight-bold">
                  {{ this.localCurrentPost.description ?? '' }}
                </div>
              </q-card-section>
            <q-img
              style="object-fit:cover;"
              v-if="this.localCurrentPost.mainImage"
              class="col-5"
              :src="this.localCurrentPost.mainImage"
            />
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="text-right" v-if="this.selectedUser._id">
        <q-btn icon="share" color="green-4" label="Share" no-caps v-on:click="sendToUser"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
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
      userData:{},
      findedUsers:[],
      selectedUser:{},
      localCurrentPost:{}
    }
  },
  methods:{
    clearAll(){
      this.userData.email = ''
      this.findedUsers = []
      this.selectedUser={}
    },
    sendToDb(){
      const allBody = {
        currentPost:this.localCurrentPost,
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.selectedUser._id}/sendPost`,allBody)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    sendToUser(){
      console.log(this.currentPost,this.selectedUser,this.userData)
      this.sendToDb()
    },
    selectEmail(data){
      console.log(data)
      this.userData.email = data.email ?? ''
      this.userData.selectedUserId = data._id
      this.selectedUser = data
      this.findedUsers = []
    },
    getUser(){
      if(this.userData.email){
        console.log(this.userData)
        const userDataPost = {
          email:this.userData.email
        }
        axios.post(`${this.store.baseUrl}/carapp/getAllUsersForSendEmailDialog`,userDataPost)
          .then(res=>{
            console.log(res)
            if(res.data.results.length){
              this.findedUsers = res.data.results
            }else{
              this.$q.notify({
                type:'negative',
                position:'right',
                message:'Try Again !',
                timeout:700,
                icon:'info'
              })
              this.userData = {}
            }
          })
          .catch(err=>{
            console.log(err)
          })
      }else{
        this.userData.email = ''
        this.findedUsers = []
      }
    },
    goBack(){
      this.store.sharedsDialogActive =! this.store.sharedsDialogActive
    }
  },
  created(){

  },
  watch:{
    currentPost:{
      handler(newValue,oldValue){
        if(newValue.postId){
          this.localCurrentPost = newValue
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
