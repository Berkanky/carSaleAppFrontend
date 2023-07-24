<template>
  <q-page class="bg-grey-2">
    <div
      v-if="!this.store.mailPageChatCompActive"
      class="row">
      <q-card class="bg-grey-2 text-dark text-capitalize col">
      <q-card-section horizontal>
        <q-input
          v-on:keyup.enter="findEmail"
          color="white"
          rounded standout v-model="this.searchValue" label="Search In Mails" class="q-pa-md col-6">
        <template v-slot:prepend>
          <q-icon name="mail" />
        </template>
        <template v-slot:append v-if="this.searchValue">
          <q-icon name="close" @click="clearInputFilter" class="cursor-pointer" />
        </template>
      </q-input>
      <q-card-section class="col text-right">
        <q-btn
          v-on:click="createNewMail"
          icon="forward_to_inbox" flat color="dark"></q-btn>
        <q-btn
          v-on:click="showAll"
          v-if="this.listType === 'onlysendeds'"
          icon="mail" flat color="dark" size="sm"></q-btn>
        <q-btn
          v-on:click="showOnlySendeds"
          v-if="this.listType === 'all'"
          icon="send" flat color="dark" size="sm"></q-btn>
        <q-btn
          v-on:Click="deleteSelectedOnlyMails()"
          icon="delete_forever" flat color="red" v-if="this.checkaddedOnlyMailListGlobal()" class="q-mr-md">
          <q-badge color="red" floating>{{ this.addedOnlyMailList.length }}</q-badge>
        </q-btn>
        <q-avatar>
          <img :src="this.store.checkImage()" alt="" v-if="this.store.checkImageOrNot()" style="object-fit:Cover;">
          <q-btn icon="person" color="dark" round v-else-if="!this.store.checkImageOrNot()"></q-btn>
        </q-avatar>
      </q-card-section>
      </q-card-section>
      <q-separator color="grey-3" size="3px"></q-separator>
      <q-card-section>
        <q-card
          v-on:click="selectPost(data)"
          v-on:mouseleave="mouseLeaveCard(data)"
          v-on:mouseover="mouseOnCard(data)"
          v-for="(data,key) in this.store.messages" :key="key"
          :class="this.checkMouseOn(data)" flat >
          <q-card-section horizontal>
            <div class="col-3">
              <q-btn
                :icon="this.checkSelectedOrNot(data) ? 'check' : 'remove'"
                size="sm"
                class="q-pa-sm"
                :color="this.checkSelectedOrNot(data) ? 'green-4' : 'grey-6'"
              ></q-btn>
              <q-checkbox
                  v-model="this.selectedDetail.addFav"
                  checked-icon="star"
                  unchecked-icon="star_border"
                  indeterminate-icon="help"
                />
              <span class="text-weight-bold">{{data.postDetail.title ? `${data.postDetail.title.slice(0,10)}...` : ''}}</span>
            </div>
            <div class="col text-subtitle2">
              <span class="text-weight-bold">{{data.postDetail.brand ?? ''}}</span>
              <span class="q-ml-sm">{{ data.postDetail.description ? data.postDetail.description.slice(0,50) : '' }}</span>
            </div>
            <div class="col-2">
              <span class="text-weight-bold">{{data.messages.length}}</span>
            </div>
          </q-card-section>
        </q-card>
        <q-card
          class="q-mt-sm"
          v-on:mouseleave="mouseLeaveCardMail(data)"
          v-on:mouseover="mouseOnCardMail(data)"
          v-for="(data,key) in this.myOnlyMails" :key="key"
          :class="this.checkMouseOnMail(data)" flat >
          <q-card-section horizontal>
            <div class="col-4">
              <q-btn
                v-on:click="addtomaillist(data)"
                :icon="this.checkaddedOnlyMailList(data) ? 'check' : 'remove'"
                size="sm"
                class="q-pa-sm"
                :color="this.checkaddedOnlyMailList(data) ? 'green-4' : 'grey-6'"
              ></q-btn>
              <q-btn
                v-if="data.mailDetail"
                v-on:click="selectMail(data)"
                size="sm"
                color="grey-5" class="q-ma-sm"
                :icon="data.mailDetail.senderId === this.store.userDetail._id ? 'send' : 'mail'"></q-btn>
              <span class="text-weight-bold text-overline" v-if="data.mailDetail.senderId !== this.store.userDetail._id">
               By {{data.senderDetail ? `${data.senderDetail.email ?? data.senderDetail.name}` : 'No Info'}}
              </span>
              <span class="text-weight-bold text-caption" v-if="data.mailDetail.senderId === this.store.userDetail._id">
                Send to {{ data.userDetail.email ?? '!' }}
              </span>
            </div>
            <div class="col text-subtitle2 q-pa-xs">
              <span class="text-weight-bold">{{data.mailDetail.subject ? `${data.mailDetail.subject.slice(0,10)}...` : ''}}</span>
              <span class="q-ml-sm">{{ data.mailDetail.message ? data.mailDetail.message.slice(0,50) : '' }}</span>
            </div>
            <div class="col-2">
              <span class="text-weight-bold">
                File ( {{ data.mailDetail.file ? data.mailDetail.file.length : 0 }} )
              </span>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
    <transition-group appear enter-active-class="animated fadeInRight slower" leave-active-class="animated fadeOutRight slower">
      <q-card
      v-if="this.checkSelectedDetail()"
      class="bg-grey-2 text-dark text-capitalize col-4">
        <q-card-section>
          <q-card class="bg-transparent" flat>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img
                    style="object-fit:cover;"
                    :src="this.selectedDetail.postDetail.mainImage" v-if="this.selectedDetail.postDetail.mainImage">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{this.selectedDetail.postDetail.title ?? ''}}</q-item-label>
                <q-item-label caption>{{this.selectedDetail.postDetail.postId}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>
        <q-card
          bordered
          v-for="(data,key) in this.store.uniqueUsers" :key="key">
            <q-card-section horizontal>
              <div class="col-3 q-pa-xs">
                <q-avatar>
                  <img
                    style="object-fit:cover;"
                    :src="data.userDetail.userImage" alt="">
                </q-avatar>
              </div>
              <div class="col text-subtitle2">
                <div>
                  <q-icon name="email" color="grey-6"></q-icon>
                  {{ data.userDetail.email ?? ''}}
                </div>
                <div>
                  <q-icon name="work" color="grey-6"></q-icon>
                  {{ data.userDetail.job ?? '' }}
                </div>
              </div>
              <div class="col-2">
                <q-btn
                  v-on:click="selectUniqueUser(data)"
                  icon="login" flat color="grey-5"></q-btn>
              </div>
            </q-card-section>
          </q-card>
      </q-card>
    </transition-group>
    </div>
    <onlyMailDetail
      :selectedMailDetail="this.selectedMailDetail"
      v-if="this.store.onlyMailDetailDialogActive"
    />
    <chatCompVue
      :selectedDetail="this.selectedDetail"
      v-if="this.store.mailPageChatCompActive"/>
    <sendEmailVue v-if="this.store.createEmailDialogActive"/>
  </q-page>
</template>

<script>
import onlyMailDetail from 'src/chatComp/onlyMailDetail.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import chatCompVue from '../chatComp/chatComp.vue'
import sendEmailVue from 'src/emailComp/sendEmail.vue'
export default {
  components:{
    chatCompVue,
    onlyMailDetail,
    sendEmailVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      searchValue:'',
      selectedDetail:{},
      mouseOnCardDetail:{},
      myOnlyMails:[],


      //for mailonly v-for
      selectedMailDetail:{},
      mouseOnCardDetailMail:{},
      addedOnlyMailList:[],

      //selected list type
      listType:'all'
    }
  },
  methods:{
    createNewMail(){
      this.store.createEmailDialogActive =! this.store.createEmailDialogActive
    },
    clearInputFilter(){
      this.searchValue = ''
      this.showAll()
    },
    findEmail(){
      console.log(this.searchValue)
      const postBody ={
        searchValue:this.searchValue,
        mailList:this.myOnlyMails
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/findEmailWithInputVal`,postBody)
        .then(res=>{
          console.log(res)
          this.myOnlyMails = res.data.postedMailList
        })
        .catch(err=>{
          console.log(err)
        })
    },
    showAll(){
      this.listType = 'all'
      this.store.getMyMails()
      this.getMyOnlyMails()
    },
    showOnlySendeds(){
      this.listType = 'onlysendeds'
      const allList = {
        messages:this.store.messages,
        myOnlyMails:this.myOnlyMails
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/showOnlyMySendeds`,allList)
        .then(res=>{
          console.log(res)
          this.myOnlyMails  = res.data.filterMails
        })
        .catch(err=>{
          console.log(err)
        })
    },
    deleteSelectedOnlyMails(){
      let addedOnlyMailList = this.addedOnlyMailList
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeOnlyMailsList`,addedOnlyMailList)
        .then(res=>{
          console.log(res)
          this.myOnlyMails.forEach(element => {
            const result = this.addedOnlyMailList.find(object => object.mailDetail._id === element.mailDetail._id)
            if(result){
              this.addedOnlyMailList = this.addedOnlyMailList.filter(object => object.mailDetail._id !== result.mailDetail._id)
              this.myOnlyMails = this.myOnlyMails.filter(object => object.mailDetail._id !== result.mailDetail._id)
            }
          });
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkaddedOnlyMailListGlobal(){
      if(this.addedOnlyMailList.length){
        return true
      }else{
        return false
      }
    },
    addtomaillist(data){
      const result = this.addedOnlyMailList.some(object => object.mailDetail._id === data.mailDetail._id)
      if(result){
        this.addedOnlyMailList = this.addedOnlyMailList.filter(object => object.mailDetail._id !== data.mailDetail._id)
      }else{
        this.addedOnlyMailList.push(data)
      }
    },
    checkaddedOnlyMailList(data){
      const result = this.addedOnlyMailList.some(object => object.mailDetail._id === data.mailDetail._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    selectMail(data){
      if(this.selectedMailDetail.mailDetail){
        if(this.selectedMailDetail.mailDetail._id === data.mailDetail._id){
          this.selectedMailDetail = {}
        }else{
          this.selectedMailDetail = data
          this.store.onlyMailDetailDialogActive = true
        }
      }else{
        this.selectedMailDetail = data
        this.store.onlyMailDetailDialogActive = true
      }
      this.selectedDetail = {}
      console.log('this.selectedMailDetail',this.selectedMailDetail)
    },
    mouseLeaveCardMail(data){
      this.mouseOnCardDetailMail = {}
    },
    mouseOnCardMail(data){
      this.mouseOnCardDetailMail = data
    },
    checkMouseOnMail(data){
      if(!this.addedOnlyMailList.length){
        if(this.mouseOnCardDetailMail.mailDetail){
        if(this.mouseOnCardDetailMail.mailDetail._id === data.mailDetail._id){
          return 'bg-grey-4'
        }else{
          return 'bg-transparent'
        }
      }else if(this.selectedMailDetail.mailDetail){
        if(this.selectedMailDetail.mailDetail._id === data.mailDetail._id){
          return 'bg-grey-4'
        }else{
          return 'bg-transparent'
        }
      }else{
        return 'bg-transparent'
      }
      }else{
        const result = this.addedOnlyMailList.some(object => object.mailDetail._id === data.mailDetail._id)
        if(result){
          return 'bg-grey-4'
        }else{
          return 'bg-transparent'
        }
      }
    },
    checkSelectedOrNotMail(data){
      if(this.selectedMailDetail.mailDetail){
        if(this.selectedMailDetail.mailDetail._id === data.mailDetail._id){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    getMyOnlyMails(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/getOnlyMails`)
        .then(res=>{
          console.log('getOnlyMails',res)
          this.myOnlyMails = res.data.mymaillist
        })
        .catch(err=>{
          console.log('getOnlyMails',err)
        })
    },
    selectUniqueUser(data){
      console.log(data)
      if(data.messages && data.messages.length > 0){
        this.store.selectedUniqueUser  = data
        this.store.selectedUniqueUserDetail = data.userDetail
        console.log('selectedUniqueUserDetail',this.store.selectedUniqueUserDetail)
        this.store.mailPageChatCompActive = true
        console.log(this.store.mailPageChatCompActive)
      }
    },
    checkSelectedDetail(){
      for(let key in this.selectedDetail){
        if (this.selectedDetail[key] !== '' && this.selectedDetail[key] !== null && this.selectedDetail.postId != '' && this.selectedDetail.postId != null) {
          return true;
        }else{
          return false
        }
      }
    },
    getSelectedMailDetail(data){
      const selectedDetail = {
        selectedDetail:data
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/getSelecetdMailDetail`,selectedDetail)
        .then(res=>{
          console.log('uniqueUsers',res)
          this.store.uniqueUsers = res.data.uniqueUsers
        })
        .catch(err=>{
          console.log(err)
        })
    },
    selectPost(data){
      console.log(data)
      console.log('uniqueUsers',this.store.uniqueUsers)
      if(this.selectedDetail.postDetail){
        if(this.selectedDetail.postDetail.postId === data.postDetail.postId){
          this.selectedDetail = {}
        }else{
          this.selectedDetail = data
          this.getSelectedMailDetail(data)
        }
      }else{
        this.selectedDetail = data
        this.getSelectedMailDetail(data)
      }
      this.selectedMailDetail = {}
    },
    mouseLeaveCard(data){
      this.mouseOnCardDetail =  {}
    },
    checkSelectedOrNot(data){
      if(this.selectedDetail.postDetail){
        if(this.selectedDetail.postDetail.postId === data.postDetail.postId){
          return  true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    checkMouseOn(data){
      if(this.selectedDetail.postDetail){
        if(this.selectedDetail.postDetail.postId === data.postDetail.postId){
          return 'bg-grey-4'
        }else{
          return ''
        }
      }else{
        if(this.mouseOnCardDetail.postDetail){
          if(this.mouseOnCardDetail.postDetail.postId ===  data.postDetail.postId){
              return 'bg-grey-4'
            }else{
              return 'bg-transparent'
            }
        }
        else{
          return 'bg-transparent'
        }
      }
    },
    mouseOnCard(data){
      this.mouseOnCardDetail = data
    }
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getMyMails()
          this.getMyOnlyMails()
        }
      },
      immediate:true,
      deep:true
    },
    selectedDetail:{
      handler(newValue,oldValue){
        if(newValue.postDetail){
          console.log('selectedDetail',newValue)
        }
      },
      immediate:true,
    }
  }
}
</script>

<style>

</style>
