<template>
  <q-dialog
    v-model="this.store.loginCompActive" persistent dark
    :maximized="this.store.mobileActive ? true : false"
    :height="this.store.mobileActive ? true : false"
  >
    <q-card
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
        'max-width':this.store.mobileActive ? '100%' : '600px'
      }"
      class="bg-dark text-white">
        <q-card-section class="text-left">
          <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar icon="person" round size="150px">
          </q-avatar>
        </q-card-section>
        <q-card-section horizontal>
          <q-input dark color="white" label="Email" type="email" class="col-6 q-pa-xs" filled v-model="this.userData.email">
            <template v-slot:prepend>
              <q-icon name="mail"></q-icon>
            </template>
            <template v-slot:append v-if="this.userData.email">
              <q-btn icon="remove" color="dark" size="sm" v-on:click="this.userData.email = ''"></q-btn>
            </template>
          </q-input>
          <q-input
            dark type="password" color="white" label="Password"
            class="col-6 q-pa-xs" filled v-model="this.userData.password">
            <template v-slot:prepend>
              <q-icon name="password"></q-icon>
            </template>
            <template v-slot:append v-if="this.userData.password">
              <q-btn icon="remove" color="dark" size="sm" v-on:click="this.userData.password = ''"></q-btn>
            </template>
          </q-input>
        </q-card-section>
        <div class="text-right">
          <q-btn icon="info" flat color="white" label="Have Issues ?" size="sm" no-caps v-on:click="changePass"></q-btn>
        </div>
        <q-card-section class="text-right q-mt-md">
          <q-btn icon="login" color="green" :disable="this.checkUserData() ? false : true" v-on:click="this.loginWithEmail()"></q-btn>
        </q-card-section>
      </q-card>
  </q-dialog>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
        email:'',
        password:''
      }
    }
  },
  methods:{
    changePass(){

    },
    checkOnlineStatus(user){
      axios.put(`${this.store.baseUrl}/carapp/users/${user.uid}/changeOnline`)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    loginWithEmail(){
      const auth = getAuth();
      const email = this.userData.email
      const password = this.userData.password
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          console.log(user)
          this.checkOnlineStatus(user)
          this.$router.push({path:'/'})
          this.store.loginCompActive = false
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    },
    checkUserData() {
      if (this.userData.email !== null && this.userData.email !== '' &&
          this.userData.password !== null && this.userData.password !== '') {
        return true;
      } else {
        return false;
      }
    },
    goBack(){
      this.store.loginCompActive = false
    }
  },
  created(){

  },
  watch:{
    'store.myAcc':{
      handler(newValue,oldValue){
        if(newValue){
          console.log(newValue)
          this.userData.email = newValue.email ?? ''
          this.userData.password = newValue.password ?? ''
        }
      },
      immediate:true,
    }
  }
}
</script>

<style>

</style>
