<template>
  <q-card
    v-if="this.store.mailPageChatCompActive"
  >
    <q-card-section class="row">
      <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
      <q-space></q-space>
      <q-avatar>
        <img
          v-if="this.store.selectedUniqueUser.userDetail.userImage"
          style="object-fit:cover;"
          :src="this.store.selectedUniqueUser.userDetail.userImage" alt="">
          <q-btn v-if="!this.store.selectedUniqueUser.userDetail.userImage" color="dark" round icon="person"></q-btn>
      </q-avatar>
    </q-card-section>
    <q-card-section class="text-dark text-right text-weight-bold" v-if="this.store.selectedUniqueUserDetail._id">
      {{ this.getselectedUniqueUserDetail() }}
    </q-card-section>
    <q-card-section horizontal>
      <q-card-section class="col-8">
        <q-card-section class="text-dark text-right text-overline text-weight-bold">
          <div class="q-pa-sm">
            <q-icon name="info" color="grey-6"></q-icon>
            Selecteds - {{ this.addedList.length }}
            <q-btn icon="delete_forever" flat color="red" v-if="this.addedList.length" v-on:click="removeSelecteds"></q-btn>
          </div>
        </q-card-section>
        <q-card
          :class="this.checkMouseOver(data)"
          v-on:mouseover="upHere(data)" v-on:mouseleave="leaveHere(data)"
          v-for="(data,key) in this.store.selectedUniqueUser.messages" :key="key"
        >
          <q-card-section horizontal>
            <div class="col-2">
              <q-btn
                v-on:click="addAddedList(data)"
                :icon="this.checkInAddedListOrNot(data) ? 'check' : 'remove'"
                size="sm"  class="q-pa-sm q-ma-sm"
                :color="this.checkInAddedListOrNot(data) ? 'green-4' : 'grey-6'"></q-btn>
            </div>
            <div class="col text-overline q-pa-sm text-dark text-weight-bold row">
              <div>
                <q-icon
                  :name="data.senderId === this.store.userDetail._id ? 'send' : 'mail'"
                  color="grey-6"></q-icon>
                {{ this.store.selectedUniqueUser.userDetail.email ?? '' }}
              </div>
              <div class="q-ml-lg">
                {{ data.message ? `${data.message.slice(0.10)}...` : '' }}
              </div>
            </div>
            <div class="col-2 text-right">
              <q-btn
                v-on:click="selectHere(data)"
                :icon="this.checkClickedOrNot(data) ? 'expand_less' : 'expand_more'"
                flat color="dark"></q-btn>
            </div>
          </q-card-section>
          <transition-group appear enter-active-class="animated fadeInUp slower" leave-active-class="animated fadeOutUp">
            <q-slide-transition v-if="this.checkClickedOrNot(data)">
            <div class="text-subtitle2 q-pa-md text-dark text-weight-bold row" v-show="this.selectedMessage._id ? true : false">
              <div class="col-9">
                <q-icon name="info"></q-icon>
                {{ this.selectedMessage.message }}
              </div>
              <div class="col-3">
                {{ this.selectedMessage.date ?? '' }}
              </div>
            </div>
          </q-slide-transition>
          </transition-group>
        </q-card>
        <q-card flat class="q-mt-md">
          <q-card-section class="text-right">
            <q-btn
              :disable="this.store.selectedUniqueUser.userDetail._id === this.store.userDetail._id ? true : false"
              v-on:click="answerButton"
              icon-right="chat" color="green-4"
              label="Answer" no-caps
            ></q-btn>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-section class="col-4">
        <q-card class="text-dark" flat>
          <q-img
            v-if="this.selectedDetail.postDetail && this.selectedDetail.postDetail.mainImage"
            :src="this.selectedDetail.postDetail.mainImage" />
          <q-card-section>
            <q-btn
              v-on:click="goCurrentPost()"
              fab
              color="primary"
              icon="login"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />

            <div class="row no-wrap items-center">
              <div class="col text-subtitle1 ellipsis text-weight-bold">
                {{ this.selectedDetail.postDetail ? this.selectedDetail.postDetail.title : 'No Title'}}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle1 text-capitalize">
              {{this.selectedDetail.postDetail ? this.selectedDetail.postDetail.brand : 'No Brand'}},
              {{ this.selectedDetail.postDetail ? this.selectedDetail.postDetail.model : 'No Info' }}
            </div>
            <div class="text-caption text-grey text-weight-bold">
              {{this.selectedDetail.postDetail ? this.selectedDetail.postDetail.description  : 'No Description'}}
            </div>
          </q-card-section>
          <q-separator />
          <q-card class="" v-if="this.checkConfirmedOrNot()">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-btn icon="person" color="dark" round v-if="!this.confirmedSalerDetail.userImage"></q-btn>
                  <img
                    style="object-fit:cover;"
                    :src="this.confirmedSalerDetail.userImage" v-if="this.confirmedSalerDetail.userImage">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-dark text-capitalize">
                  {{this.confirmedSalerDetail.email != '' ? this.confirmedSalerDetail.email : this.confirmedSalerDetail.name}}
                  <span class="text-green-6">( Buyer )</span>
                </q-item-label>
                <q-item-label caption class="text-capitalize text-weight-bold">{{this.confirmedSalerDetail.job ?? 'No Job Info'}}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-btn
                  :icon="this.checkConfirmedOrNot() ? 'remove' : 'check'"
                  :label="this.checkConfirmedOrNot() ? 'Remove' : 'Apply'"
                  no-caps flat :color="this.checkConfirmedOrNot() ? 'red-4' : 'green-4'"  v-on:click="saleSelectedUser"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
          <q-card-actions v-if="!this.checkConfirmedOrNot()">
            <q-btn

              :icon="this.checkConfirmedOrNot() ? 'remove' : 'check'"
              :label="this.checkConfirmedOrNot() ? 'Remove' : 'Apply'"
              no-caps flat :color="this.checkConfirmedOrNot() ? 'red-4' : 'green-4'"  v-on:click="saleSelectedUser"></q-btn>
          </q-card-actions>
        </q-card>
      </q-card-section>
    </q-card-section>
    <asnwerDialogVue
      :localSelectedDetail="this.localSelectedDetail"
      v-if="this.store.answerDialogActive"/>
  </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
import asnwerDialogVue from './asnwerDialog.vue'
export default {
  components:{
    asnwerDialogVue
  },
  props:['selectedDetail'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      localSelectedDetail:{},
      addedList:[],
      selectedMessage:{},
      mouseOnCard:{},
      confirmedSalerDetail:{}
    }
  },
  methods:{
    goCurrentPost(){
      this.$q.dialog({
        cancel:true,
        title:'Warning',
        message:'You Leaving Current Page ',
      }).onOk(()=>{
        this.$router.push({path:`/detailCarSalePost/${this.selectedDetail.postId}`})
      })
    },
    getselectedUniqueUserDetail(){
      if(this.store.selectedUniqueUserDetail.email != '' && this.store.selectedUniqueUserDetail.email != null && this.store.selectedUniqueUserDetail.email == '' && this.store.selectedUniqueUserDetail.email == null){
        const email = this.store.selectedUniqueUserDetail.email
        return email
      }else if(this.store.selectedUniqueUserDetail.email == '' && this.store.selectedUniqueUserDetail.email == null && this.store.selectedUniqueUserDetail.name != '' && this.store.selectedUniqueUserDetail.name != null){
        const name = this.store.selectedUniqueUserDetail.name
        return name
      }else{
        return this.store.selectedUniqueUserDetail._id
      }
    },
    getConfirmedSaleUserDetail(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.selectedDetail.postId}/getConfirmedSalerDetail`)
        .then(res=>{
          console.log('getConfirmedSalerDetail',res)
          this.confirmedSalerDetail = res.data.confirmedsaleuserdetail
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkConfirmedOrNot(){
      if(this.selectedDetail.postDetail){
        if(this.selectedDetail.postDetail.confirmedSaleUser){
          if(this.selectedDetail.postDetail.confirmedSaleUser != '' && this.selectedDetail.postDetail.confirmedSaleUser != null){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      }else{
        return false
      }
    },
    removeSelecteds(){
      console.log(this.addedList)
      let addedList = this.addedList
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeSelectedMessage`,addedList)
        .then(res=>{
          console.log(res)
          this.addedList.forEach(element => {
            this.store.selectedUniqueUser.messages = this.store.selectedUniqueUser.messages.filter(object => object._id !==  element._id)
          });
        })
        .catch(err=>{
          console.log(err)
        })
    },
    addAddedList(data){
      const result = this.addedList.find(object => object._id === data._id)
      if(result){
        this.addedList = this.addedList.filter(object => object._id !== data._id)
      }else{
        this.addedList.push(data)
      }
    },
    checkInAddedListOrNot(data){
      const result = this.addedList.find(object => object._id === data._id)
      if(result){
        return true
      }else{
        return false
      }
    },
    answerButton(){
      this.store.answerDialogActive = true
    },
    checkSelected(data){
      if(this.selectedMessage._id === data._id){
        return true
      }else{
        return false
      }
    },
    selectHere(data){
      if(this.selectedMessage._id === data._id){
        this.selectedMessage = {}
      }else{
        this.selectedMessage = data
        this.selectedMessage.check = true
      }
    },
    checkClickedOrNot(data){
      if(this.selectedMessage._id === data._id){
        return true
      }else{
        return false
      }
    },
    checkMouseOver(data){
      if(this.selectedMessage._id === data._id){
        return 'bg-grey-4'
      }else{
        if(this.mouseOnCard._id === data._id){
          return 'bg-grey-3'
        }else{
          return ''
        }
      }
    },
    upHere(data){
      this.mouseOnCard = data
    },
    leaveHere(data){
      this.mouseOnCard = {}
    },
    saleSelectedUser(){
      this.$q.dialog({
        cancel:true,
        title:'Warning',
        message:`Confirm Sale For ${this.store.selectedUniqueUser.userDetail.email ?? ''}`
      }).onOk(()=>{
        axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.store.selectedUniqueUser.userDetail._id}/${this.selectedDetail.postId}/addConfirmSaler`)
          .then(res=>{
            console.log(res)
            this.selectedDetail.postDetail = res.data.selectedCarSchema
            this.getConfirmedSaleUserDetail()
          })
          .catch(err=>{
            console.log(err)
          })
      })
    },
    goBack(){
      this.store.mailPageChatCompActive = false
    }
  },
  watch:{
    'store.selectedUniqueUser':{
      handler(newValue,oldValue){
        if(newValue._id){
          /* console.log('selecteduniqueser',newValue) */
        }
      },
      immediate:true,
      deep:true
    },
    selectedDetail:{
      handler(newValue,oldValue){
        if(newValue){
          console.log('chatcompselecteddeatil',newValue)
          this.localSelectedDetail = newValue
          if(newValue.postId != '' && newValue != null){
            this.getConfirmedSaleUserDetail()
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
