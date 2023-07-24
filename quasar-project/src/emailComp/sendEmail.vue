<template>
  <q-dialog
    v-model="this.store.createEmailDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '550px',
        'max-width':this.store.mobileActive ? '100%' : '550px'
      }"
    >
      <q-card-section class="text-left">
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
            <q-btn icon="remove" size="sm" color="dark" v-on:click="this.userData.email = '';this.findedUsers = []"></q-btn>
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
        <q-input
          class="q-mt-sm"
          v-model="this.userData.subject"
          filled color="dark" label="Enter Subject"
        >
          <template v-slot:prepend>
            <q-icon name="subject"></q-icon>
          </template>
        </q-input>
        <q-input
          class="q-mt-sm"
          type="textarea"
          v-model="this.userData.message"
          filled color="dark" label="Enter Messaage"
        >
          <template v-slot:prepend>
            <q-icon name="chat"></q-icon>
          </template>
        </q-input>
      </q-card-section>
      <div class="row q-pa-sm">
        <q-btn
            class="col-3"
            v-on:click="removeFromFile(data)"
            v-for="(data,key) in this.userData.file" :key="key"
            :label="data.name" color="grey-8" rounded></q-btn>
      </div>
      <q-card-section class="text-right">
          <div>
            <input type="file" id="file" />
            <button @click="uploadFile">Upload File</button>
          </div>
        </q-card-section>
      <q-card-section class="row">
        <q-btn
          v-if="this.checkMessageData()"
          icon="clear_all" color="red-4" label="Clear" no-caps v-on:click="clearData"></q-btn>
          <q-btn
            :disable="this.checkMessageData() ? false : true"
            v-on:click="sendMail"
            icon="send" color="green-4" label="Send" no-caps></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
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
      userData:{
        file:[]
      },
      findedUsers:[],
      fileUrl:'',
      selectedUser:{}
    }
  },
  methods:{
    removeFromFile(data){
      this.userData.file = this.userData.file.filter(object => object.name !== data.name)
    },
    uploadFile() {
      const file = document.getElementById("file").files[0];
      const formData = new FormData();
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.fileUrl = e.target.result;
        console.log('fileUrl', this.fileUrl);
        formData.append("file", file);
        const newfileData = {
          lastModified: file.lastModified,
          name: file.name,
          size: file.size,
          type: file.type,
          webkitRelativePath: file.webkitRelativePath,
          fileUrl: this.fileUrl
        };
        const result = this.userData.file.some(object => object.name === newfileData.name)
        if(!result){
          this.userData.file.push(newfileData)
        }
        console.log(this.userData);
      };
      fileReader.readAsDataURL(file);
      console.log('file', file);
    },
    sendMail(){
      console.log(this.userData)
      const messageData = {
        subject:this.userData.subject ?? '',
        messageId:uuidv4(),
        senderId:this.store.userDetail._id,
        message:this.userData.message,
        selectedUserId:this.selectedUser._id,
        postId:'',
        file:this.userData.file,
      }
      const allBody = {
        messagePost:messageData,
        senderUserDetail:this.store.userDetail
      }
      console.log(allBody)
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.selectedUser._id}/sendOnlyEmail`,allBody)
        .then(res=>{
          console.log(res)
          this.userData = {}
          this.$q.notify({
            type:'positive',
            icon:'check',
            position:'right',
            message:'Mail Sended.'
          })
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearData(){
      this.userData = {}
    },
    checkMessageData(){
      for(let key in this.userData){
        if(this.userData[key] !== '' && this.userData[key] !== null){
          return true
        }else{
          return false
        }
      }
    },
    selectEmail(data){
      console.log(data)
      this.userData.email = data.email ?? ''
      this.userData.selectedUserId = data._id
      this.selectedUser = data
      this.findedUsers = []
    },
    goBack(){
      this.store.createEmailDialogActive =! this.store.createEmailDialogActive
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
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
