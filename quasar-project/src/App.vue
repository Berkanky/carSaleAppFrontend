<template>
 <div class="appAll bg-dark text-white">
    <transition-group apper enter-active-class="animated fadeIn slower" leave-active-class="animated fadeOut slower">
      <router-view />

    </transition-group>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { defineComponent } from 'vue'
import axios from 'axios'
import { useCounterStore } from './stores/store';
export default defineComponent({
  components:{
  },
  name: 'App',
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    getMyInfoFromMongoDb(){
      axios.get(`${this.store.baseUrl}/carapp/users/${this.store.firebaseInfoUser.uid}`)
        .then(res=>{
          console.log('userDetail',res)
          this.store.userDetail = res.data
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkCurrentUserStatus(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          // ...
          this.store.firebaseInfoUser = user
          console.log('firebaseInfoUser',this.store.firebaseInfoUser)
        } else {
          // User is signed out
          // ...
          this.$router.replace({path:'/login'})
        }
      });
    },
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
      //console.log('window',this.window)
    },
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch:{
    'store.firebaseInfoUser':{
      handler(newValue,oldValue){
        if(newValue != '' && newValue != null){
          this.getMyInfoFromMongoDb()
        }
      },
      immediate:true,
      deep:true
    },
    $route:{
      handler(to,from){
        console.log(to,from)
        const path  = to.fullPath
        if(this.$route.path !== '/login'){
          this.checkCurrentUserStatus()
        }
      }
    },
    'store.window':{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.store.newHeight = 300
          this.store.mobileActive = true
          console.log('newHeight',this.store.newHeight)
          console.log('avatar',this.store.mobileActive)
        }else{
          this.store.newHeight = ''
          this.store.mobileActive = false
          console.log('avatar',this.store.mobileActive)
          console.log('newHeight',this.store.newHeight)
        }
      },
      immediate:true,
      deep:true
    },
  }
})
</script>


<style>
  .appAll{
    font-family: 'Montserrat', sans-serif;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>
