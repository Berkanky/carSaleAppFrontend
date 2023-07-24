<template>
  <q-dialog
    v-model="this.store.onlyMailDetailDialogActive"
    :full-height="this.store.mobileActive ? true  : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'right'"
    transition-show="slide-left"
    transition-hide="slide-right"
    transition-duration="1000"
  >
  <q-card
    :style="{
      'width':this.store.mobileActive ? '100%' : '550px',
      'max-width':this.store.mobileActive ? '100%' : '550px'
    }"
  >
    <div class="row">
      <q-btn icon="keyboard_backspace " flat color="dark" v-on:click="goBack"></q-btn>
      <q-space></q-space>
      <q-btn icon="star" flat color="dark"></q-btn>
    </div>
    <div class="text-h6 q-pa-md text-capitalize">
      {{ this.mailDetail.subject ?? '' }}
    </div>
    <div class="q-pa-md row">
      <q-avatar class="">
        <img
          style="object-fit:cover;"
          v-if="this.userDetail.userImage"
          :src="this.userDetail.userImage" alt="">
        <q-btn icon="person" v-if="!this.userDetail.userImage" color="dark" round></q-btn>
      </q-avatar>
      <div class="text-subtitle2 text-weight-bold q-pa-sm" style="display:block;">
        <span style="display:block;">{{ this.userDetail.email ?? '' }}</span>
        <span class="text-grey-5 text-weight-bold">
          {{this.mailDetail.senderId === this.store.userDetail._id ? 'Gönderici' : 'Alıcı'}} <q-btn icon="expand_more" flat color="dark" size="sm">
            <q-popup-proxy>
              <q-banner class="bg-grey-9 text-white row">
                <div class="text-subtitle2 col-3">
                  <div class="q-pa-sm">
                    Sender : {{ this.store.userDetail.email ?? '' }}
                  </div>
                  <div class="q-pa-sm">
                    Receiver : {{ this.userDetail.email ?? '' }}
                  </div>
                  <div class="q-pa-sm">
                    Date : {{ this.mailDetail.date ?? '' }}
                  </div>
                  <div class="q-pa-sm">
                    Subject : {{ this.mailDetail.subject ?? '' }}
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </span>
      </div>
    </div>
    <div class="text-overline text-capitalize q-pa-md">
        {{ this.mailDetail.message  ?? '' }}
    </div>
    <div class=" q-pa-md" v-if="this.checkFile()">
      <q-btn
        v-for="(data,key) in  this.mailDetail.file" :key="key"
        v-on:click="downloadFile(data)"
        :label="data.name ? data.name : ''" color="grey-8" no-caps icon-right="download"
      ></q-btn>
    </div>
    <q-card-section>
      <q-btn
        class="q-ml-sm"
        icon="reply"
        color="green-4"
        v-on:click="replyToMessage"
        label="Reply"
      ></q-btn>
    </q-card-section>
  </q-card>
    <q-dialog
      v-model="this.replyCompActive"
      :full-height="this.store.mobileActive ? true  : false"
      :maximized="this.store.mobileActive ? true : false"
      persistent
      :position="this.store.mobileActive ? 'center' : 'right'"
      transition-show="slide-left"
      transition-hide="slide-right"
      transition-duration="1000"
    >
      <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '550px',
        'max-width':this.store.mobileActive ? '100%' : '550px'
      }"
      >
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goFirstComp"></q-btn>
        </q-card-section>
        <div class="q-pa-md row text-grey-6 text-weight-bold">
          <q-avatar class="">
            <img
              style="object-fit:cover;"
              v-if="this.userDetail.userImage"
              :src="this.userDetail.userImage" alt="">
            <q-btn icon="person" v-if="!this.userDetail.userImage" color="dark" round></q-btn>
          </q-avatar>
          <div class="text-subtitle2 text-weight-bold q-pa-sm" style="display:block;">
            <q-icon name="mail"></q-icon>
            <span style="display:block;">{{ this.userDetail.email ?? '' }}</span>
          </div>
        </div>
        <q-card-section>
          <q-input
            v-model="this.replyData.subject"
            filled color="dark" label="Subject"
          >
            <template v-slot:prepend>
              <q-icon name="title"></q-icon>
            </template>
          </q-input>
          <q-input
            class="q-mt-sm"
            v-model="this.replyData.message"
            type="textarea" filled color="dark"
            label="Enter Your Message"
          >
            <template v-slot:prepend>
              <q-icon name="mail"></q-icon>
            </template>
            <template v-slot:append v-if="this.replyData.message">
              <q-btn icon="remove" color="dark" size="sm" v-on:click="this.replyData.message = ''"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section >
          <q-btn
            v-on:click="removeFromFile(data)"
            v-for="(data,key) in this.replyData.file" :key="key"
            :label="data.name" color="grey-8" rounded></q-btn>
        </q-card-section>
        <q-card-section class="text-right">
          <div>
            <input type="file" id="file" />
            <button @click="uploadFile">Upload File</button>
          </div>
        </q-card-section>
        <q-card-section class="text-right" v-if="this.checkMessageData()">
          <q-btn icon="clear_all" color="red-4" label="Clear" no-caps v-on:click="clearReplyData"></q-btn>
          <q-btn
            v-on:click="sendReplyMessage"
            icon="send" color="green-4" label="Send" no-caps></q-btn>
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
  props:['selectedMailDetail'],
  components:{
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      mailDetail:{},
      userDetail:{},
      localSelectedDetail:{},
      replyCompActive:false,

      //replydata
      replyData:{
        file:[]
      },
      fileUrl:''
    }
  },
  methods:{
    removeFromFile(data){
      this.replyData.file = this.replyData.file.filter(object => object.name !== data.name)
    },
    downloadFile(data){
      console.log(this.mailDetail)
      console.log(data._id)
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.mailDetail._id}/${data._id}/downloadFileUrl`)
        .then(res=>{
          console.log(res)
          const link = document.createElement('a');
          link.href = res.data.selectedfile.fileUrl;
          link.download = res.data.selectedfile.name ?? uuidv4();
          link.click();
        })
        .catch(err=>{
          console.log(err)
        })
    },
    sendReplyMessage(){
      const messagePost = {
        subject:this.replyData.subject ?? '',
        messageId:uuidv4(),
        senderId:this.store.userDetail._id,
        message:this.replyData.message ?? '',
        selectedUserId:this.userDetail._id,
        senderPhoneNumber:this.store.userDetail.communicationNumber ?? '',
        postId:'',
        file:this.replyData.file
      }

      console.log(this.replyData)
      console.log(messagePost)
      const allBody = {
        messagePost:messagePost,
        senderUserDetail:this.store.userDetail
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.userDetail._id}/sendOnlyEmail`,allBody)
        .then(res=>{
          console.log(res)
          this.$q.notify({
            type:'positive',
            title:'Warning',
            icon:'info',
            message:'Message Sended.',
            timeout:700,
            position:'right'
          })
          this.replyData = {
            file:[]
          }
          this.fileUrl = ''
        })
        .catch(err=>{
          console.log(err)
        })
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
        const result = this.replyData.file.some(object => object.name === newfileData.name)
        if(!result){
          this.replyData.file.push(newfileData)
        }
        console.log(this.replyData);
      };
      fileReader.readAsDataURL(file);
      console.log('file', file);
    },
    clearReplyData(){
      this.replyData = {}
    },
    checkFile(){
      if(this.mailDetail.file){
        if(this.mailDetail.file.length){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    checkMessageData(){
      for(let key in this.replyData){
        if(this.replyData[key] !== '' && this.replyData[key] !== null){
          return true
        }else{
          return false
        }
      }
    },
    goFirstComp(){
      this.replyCompActive =! this.replyCompActive
    },
    replyToMessage(){
      const selectedMailDetail = {
        userDetail:this.userDetail,
        mailDetail:this.mailDetail
      }
      this.localSelectedDetail  = selectedMailDetail
      this.replyCompActive =! this.replyCompActive
    },
    goBack(){
      this.store.onlyMailDetailDialogActive = false
    }
  },
  created(){

  },
  watch:{
    selectedMailDetail:{
      handler(newValue,oldValue){
        if(newValue.mailDetail && newValue.userDetail){
          this.mailDetail = newValue.mailDetail
          this.userDetail = newValue.userDetail
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
