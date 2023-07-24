<template>
  <q-layout view="lHr LpR fFf">

    <q-header elevated class="bg-grey-9 text-white" v-if="this.$route.path!=='/login'">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" v-if="this.$route.path!=='/login'"/>
        <q-toolbar-title>
          <q-avatar>
            <img :src="logo">
          </q-avatar>
          AutoTrader
        </q-toolbar-title>
        <q-btn icon="notifications" flat color="white" v-on:click="this.store.notifyDialogActive =! this.store.notifyDialogActive"></q-btn>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" v-if="this.$route.path!=='/login'"/>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-if="this.$route.path!=='/login'"
        bordered elevated
        v-model="leftDrawerOpen"
        show-if-above
        :width="300"
        dark
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
          <q-list
            :class="this.checkCurrentPath(data)"
            padding v-for="(data,key) in this.options" :key="key" v-on:click="selectOption(data)">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="data.icon"/>
              </q-item-section>
              <q-item-section>
                {{data.label}}
              </q-item-section>
            </q-item>
            <profileLists v-if="data.id == 2 && this.$route.path === '/profile'"/>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img
                v-if="this.store.checkImageOrNot()"
                style="object-fit:cover;"
                :src="this.store.checkImage()">
              <q-btn icon="person" v-if="!this.store.checkImageOrNot()" round color="dark"></q-btn>
            </q-avatar>
            <div class="text-weight-bold">{{this.store.userDetail.name ?? ''}} {{ this.store.userDetail.lastName ?? '' }}</div>
            <div>
              {{ this.store.userDetail.email }}
              <q-btn icon="mail" color="white" flat round size="sm" v-on:click="goMails">
                <q-badge floating color="red" rounded />
              </q-btn>
              <q-btn icon="person" color="white" flat round size="sm" v-on:Click="goFollows">
                <q-badge floating color="red" rounded />
              </q-btn>
            </div>
          </div>
        </q-img>
      </q-drawer>
    <q-drawer
      show-if-above v-model="rightDrawerOpen" side="right" elevated
      v-if="this.$route.path!=='/login' && rightDrawerOpen">
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-dark text-white q-pa-md">
    </q-footer>
  </q-layout>
</template>

<script>
import logo from '../images/logo.png'
import profileLists from 'src/profilecomp/profileLists.vue'
import axios from 'axios'
import {auth} from '../firebase/index'
import { getAuth, signOut } from "firebase/auth";
import { ref } from 'vue'
import { useCounterStore } from 'src/stores/store'
export default {
  components:{
    profileLists
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const store = useCounterStore()
    return {
      store,
      logo,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  },
  data:function(){
    return{
      options:[
        {id:1,label:'Home',icon:'home',name:'home'},
        {id:2,label:'Profile',icon:'person',name:'profile'},
        {id:4,label:'Saveds',icon:'bookmark',name:'savedCarPosts'},
        {id:3,label:'Logout',icon:'logout',name:'login'},
      ]
    }
  },
  methods:{
    goFollows(){
      this.store.myFollowsDialogActive =! this.store.myFollowsDialogActive
    },
    goMails(){
      this.$router.push({path:`/myMails/${this.store.userDetail._id}`})
    },
    checkCurrentPath(data){
      if(data.name === this.$route.name){
        return 'bg-grey-4 text-dark'
      }else{
        return 'bg-dark text-white'
      }
    },
    changeOnlineStatus(){
      axios.put(`${this.store.baseUrl}/carapp/users/${this.store.firebaseInfoUser.uid}/changeOnline`)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    selectOption(data){
      if(data.id === 3){
        this.$q.dialog({
          dark:true,
          cancel:true,
          title:'Warning',
          message:'Are you sure you want to log out?'
        }).onOk(()=>{
          const auth = getAuth();
          signOut(auth).then(() => {
            // Sign-out successful.
            this.changeOnlineStatus()
            this.$router.replace({path:'/login'})
            this.leftDrawerOpen = false
            this.rightDrawerOpen = false
            this.$q.notify({
              type:'negative',
              position:'top',
              timeout:1000,
              icon:'info',
              message:'You have successfully logged out.'
            })
            this.store.userDetail = {}
            this.store.firebaseInfoUser = {}
          }).catch((error) => {
            // An error happened.
          });
        })
      }else{
        this.$router.push({name:data.name})
      }
    }
  }
}
</script>
