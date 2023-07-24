<template>
  <q-dialog
    v-model="this.store.answerDialogActive"
    :maximized="this.store.mobileActive ? true : false"
    persistent
  >
  <q-card
    :style="{
      'width':this.store.mobileActive ? '100%' : '550px',
      'height':this.store.mobileActive ? '100%' : '350px'
    }"
  >
    <q-card-section class="row">
      <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
      <q-space></q-space>
    </q-card-section>
    <q-card-section>
      <q-card flat>
        <q-card-section horizontal>
          <q-card-section class="col-3">
            <q-avatar size="100px">
              <img
                v-if="this.store.selectedUniqueUser.userDetail.userImage"
                style="object-fit:cover;"
                :src="this.store.selectedUniqueUser.userDetail.userImage" alt="">
                <q-btn v-if="!this.store.selectedUniqueUser.userDetail.userImage" color="dark" round icon="person"></q-btn>
            </q-avatar>
          </q-card-section>
          <q-card-section class="col">
            <div class="text-subtitle2 q-pa-md">
              <q-icon
                name="mail"
                color="grey-6"></q-icon>
              {{ this.store.selectedUniqueUser.userDetail.email ?? '' }}
            </div>
            <div class="text-subtitle2 q-pa-xs">
              <q-icon name="work" color="grey-6"></q-icon>
              {{ this.store.selectedUniqueUser.userDetail.job ?? '' }}
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section>
      <q-input
        color="dark"
        v-model="this.messageValue"
        filled label="Enter Message">
        <template v-slot:prepend>
          <q-icon name="chat"></q-icon>
        </template>
        <template v-slot:append v-if="this.messageValue">
          <q-btn icon="remove" color="dark" size="sm" v-on:click="this.messageValue = ''"></q-btn>
        </template>
        <template v-slot:after v-if="this.messageValue">
          <q-btn icon="send" color="green-4" round v-on:Click="sendMessage"></q-btn>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  props:['localSelectedDetail'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      messageValue:'',
      selectedDetail:{}
    }
  },
  methods:{
    sendMessage(){

    },
    goBack(){
      this.store.answerDialogActive = false
    }
  },
  created(){

  },
  watch:{
    localSelectedDetail:{
      handler(newValue,oldValue){
        if(newValue){
          this.selectedDetail = this.localSelectedDetail
          console.log('localSelectedDetail',this.selectedDetail)
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
