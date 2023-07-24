<template>
  <q-dialog
    v-model="this.store.showViewersDialogActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      class="text-white bg-dark"
      :style="{
        'width':this.store.mobileActive ? '100%' : '500px',
        'max-width':this.store.mobileActive ? '100%' : '500px'
      }"
    >
      <q-card-section class="text-left">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        </q-card-section>
          <q-card-section>
            <q-card
              v-for="(data,key) in this.store.selectedPostVisiters" :key="key"
              class="q-ma-xs text-dark" flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img
                      style="object-fit:cover;"
                      :src="data.userImage" v-if="data.userImage">
                    <q-btn icon="person" color="dark" round v-if="!data.userImage"></q-btn>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ data.email ?? data.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{data.job  ?? 'No Info'}}
                  </q-item-label>
                </q-item-section>
                <q-item-section class="col-2">
                  <q-btn icon="info" flat color="grey-8" v-on:click="userDetail(data)"></q-btn>
                </q-item-section>
              </q-item>
            </q-card>
        </q-card-section>
    </q-card>
    <userDetailPluginVue v-if="this.store.selecteUserProfileCompActive"/>
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
  props:['currentPost'],
  setup(){
    const store  = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    userDetail(data){
      this.store.selecteUserProfile = data
      this.store.selecteUserProfileCompActive =! this.store.selecteUserProfileCompActive
    },
    goBack(){
      this.store.showViewersDialogActive =! this.store.showViewersDialogActive
    },
    getSelectedPostVisitDetail(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.currentPost.postId}/getSelectedPostAllVisits`)
        .then(res=>{
          console.log('getSelectedPostVisitDetail',res)
          this.store.selectedPostVisiters = res.data.visiters
        })
        .catch(err=>{
          console.log(err)
        })
    },
  },
  created(){

  },
  watch:{
    currentPost:{
      handler(newValue,oldValue){
        if(newValue){
          console.log('currentPost',this.currentPost)
          this.getSelectedPostVisitDetail()
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
