<template>
  <q-dialog
    v-model="this.store.myFollowsDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'left'"
    persistent
  >
    <q-card
      bordered
      :style="{
        'width':this.store.mobileActive ? '100%' : '550px',
        'max-width':this.store.mobileActive ? '100% ': '550px'
      }"
      class="bg-dark text-white">
        <q-card-section class="row">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
          <q-space></q-space>
          <q-btn icon="search" flat color="white" v-on:click="findUser"></q-btn>
        </q-card-section>
        <q-card-section class="text-center" v-if="!this.findedUsers.length">
          <q-btn
            :color="this.listTypeCheck(data)"
            v-for="(data,key) in this.options" :key="key"
            :icon="data.icon"
            :label="data.label"
            v-on:click="changeListType(data)"
          ></q-btn>
        </q-card-section>
        <q-card-section
          v-if="this.selectedOption.id === 1&&!this.findedUsers.length"
        >
          <q-card
            v-for="(data,key) in this.followList" :key="key"
            flat
            class="bg-transparent text-white">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
                  <img :src="data.userImage" v-if="data.userImage" style="object-fit:cover;">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon name="mail"></q-icon>
                  {{data.email ?? data.name}}</q-item-label>
                <q-item-label caption class="text-white">
                  <q-icon name="work"></q-icon>
                  {{ data.job ?? 'No Job' }}, {{ data.email ? data.name : '' }}
                </q-item-label>
              </q-item-section>
              <q-item-section class="text-right">
                <q-btn
                  v-on:click="selectUser(data)"
                  icon="info" flat color="white"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>
        <q-card-section
          v-if="this.selectedOption.id === 2&&!this.findedUsers.length"
        >
          <q-card
            v-for="(data,key) in this.followerList" :key="key"
            flat
            class="bg-transparent text-white">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
                  <img :src="data.userImage" v-if="data.userImage" style="object-fit:cover;">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon name="mail"></q-icon>
                  {{data.email ?? data.name}}</q-item-label>
                <q-item-label caption class="text-white">
                  <q-icon name="work"></q-icon>
                  {{ data.job ?? 'No Job' }}, {{ data.email ? data.name : '' }}
                </q-item-label>
              </q-item-section>
              <q-item-section class="text-right">
                <q-btn
                  v-on:click="selectUser(data)"
                  icon="info" flat color="white"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>
        <q-card-section
          v-if="this.findedUsers.length"
        >
        <q-card-section class="row">
          <div class="text-overline text-weight-bold text-grey-5 q-pa-sm">
            <q-icon name="info"></q-icon>
            {{ this.findedUsers.length }} Result -
          </div>
          <q-space></q-space>
          <q-btn icon="clear_all" flat color="red-4" v-on:click="clearAll"></q-btn>
        </q-card-section>
        <q-card
            v-for="(data,key) in this.findedUsers" :key="key"
            flat
            class="bg-transparent text-white">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
                  <img :src="data.userImage" v-if="data.userImage" style="object-fit:cover;">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-icon name="mail"></q-icon>
                  {{data.email ?? data.name}}</q-item-label>
                <q-item-label caption class="text-white">
                  <q-icon name="work"></q-icon>
                  {{ data.job ?? 'No Job' }}, {{ data.email ? data.name : '' }}
                </q-item-label>
              </q-item-section>
              <q-item-section class="text-right">
                <q-btn
                  v-on:click="selectUser(data)"
                  icon="info" flat color="white"></q-btn>
              </q-item-section>
            </q-item>
          </q-card>
        </q-card-section>
      </q-card>
      <userDetailPluginVue
        @followList="getfollowList"
        v-if="this.store.selecteUserProfileCompActive"/>
  </q-dialog>
</template>

<script>
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
      findUserVal:'',
      followList:[],
      followerList:[],
      options:[
        {id:1,val:'followList',icon:'send',label:'Follow List'},
        {id:2,val:'FollowerList',icon:'groups',label:'Follower List'}
      ],
      selectedOption:{
        id:1,val:'followList',icon:'send',label:'Follow List'
      },
      findedUsers:[]
    }
  },
  methods:{
    getfollowList(data){
      console.log(data)
      if(data){
        const result = data.followList.some(object => object.userId === data.selecteUserProfile._id)
        if(!result){
          this.followList = this.followList.filter(object => object._id !== data.selecteUserProfile._id)
        }else{
          const id = this.store.userDetail._id
          this.store.getMyFolListsDetail(id)
        }
      }
    },
    clearAll(){
      this.findedUsers = []
    },
    findUserFilterFunction(data){
      const allBody = {
        findUserVal:data
      }
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/findInFollowsAndFollowers`,allBody)
        .then(res=>{
          console.log(res)
          if(res.data.findedCheck === true){
            this.findedUsers = res.data.findedUsers
          }else{
            this.findedUsers = []
            this.$q.notify({
              type:'negative',
              message:'Please Try Again !',
              icon:'info',
              position:'top'
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    findUser(){
      this.$q.dialog({
        dark: true,
        title: 'Find User',
        message: 'Enter User Name or Email.',
        position:this.store.mobileActive ? 'center' : 'left',
        maximized:this.store.mobileActive ? true : false,
        fullHeight:this.store.mobileActive ? true : false,
        prompt: {
          model: this.findUserVal,
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        console.log(data)
        if(data){
          this.findUserFilterFunction(data)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Please Enter Name Or Email',
            icon:'info',
            position:'top'
          })
        }
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    selectUser(data){
      this.store.selecteUserProfile = data
      this.store.selecteUserProfileCompActive =! this.store.selecteUserProfileCompActive
    },
    listTypeCheck(data){
      if(data.id === this.selectedOption.id){
        return 'green-4'
      }else{
        return 'grey-7'
      }
    },
    goBack(){
      this.store.myFollowsDialogActive =! this.store.myFollowsDialogActive
    },
    changeListType(data){
      this.selectedOption = data
      console.log(this.selectedOption)
    }
  },
  created(){

  },
  watch:{
    'store.detailedFolList':{
      handler(newValue,oldValue){
        if(newValue.followList && newValue.followerList){
          this.followList = newValue.followList.length ? newValue.followList : []
          this.followerList = newValue.followerList.length ? newValue.followerList : []
          console.log('followList',this.followList)
          console.log('followerList',this.followerList)
        }
      },
      immediate:true,
      deep:true
    },
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          const id = newValue._id
          console.log(id)
          if(id !== '' && id !== null){
            this.store.getMyFolListsDetail(id)
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
