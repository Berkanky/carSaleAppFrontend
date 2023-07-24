<template>
  <q-card
    style="margin:0 auto;"
    :style="{
      'width':this.store.mobileActive ? '100%' : '700px',
      'max-width':this.store.mobileActive  ? '100%' : '700px',
      'height':this.$q.screen.height + 'px'
    }"
    bordered dark
    class="text-white">
      <q-card-section>
        <q-scroll-area
          dark
          style="width:100%;"
          :style="{
            'height':(this.$q.screen.height - 50) + 'px'
          }"
        >
        <q-card
          class="bg-grey-3 text-dark q-mt-sm"
          v-for="(data,key) in this.store.allSharedList" :key="key"
          style="width:100%;height:100%;"
        >
          <q-parallax
            :src="data.postDetail.mainImage"
            :height="250"
          >
            <div class="absolute-top-right bg-transparent">
              <q-btn icon="delete_forever" flat color="red" v-on:click="deleteMessage(data)"></q-btn>
            </div>
          </q-parallax>
            <q-card-section class="text-capitalize">
              <div class="text-h6 row">
                <q-icon name="title"></q-icon>
                {{ data.postDetail.title ?? '' }}
                <q-space></q-space>
                <q-btn icon="question_mark" flat color="dark" v-on:click="goDetail(data)"></q-btn>
              </div>
              <div class="text-subtitle2">
                <span class="text-weight-bold">
                  <q-icon :name="this.checkSenderOrNot(data) ? 'send' : 'mail'"></q-icon>
                  {{ this.checkSenderOrNot(data) ? 'To' : 'By' }}
                </span>
                <q-btn
                  :label="this.checkSenderOrNot(data) ? data.sendedDetail.email ?? data.sendedDetail.name : data.senderDetail.email ?? data.senderDetail.names"
                  flat color="dark" no-caps
                  v-on:click="showDetail(data)"
                ></q-btn>
              </div>
              <div class="text-caption text-grey-8s text-weight-bold">
                <q-icon name="event"></q-icon>
                {{ data.date }}
              </div>
              <div class="text-subtitle2 text-grey-7 text-weight-bold q-pa-md">
                <q-icon name="info"></q-icon>
                {{ data.postDetail.description ?? '' }}
              </div>
            </q-card-section>
          </q-card>
          <q-card
          v-if="!this.store.allSharedList.length"
          class="bg-grey-3 text-dark q-mt-sm"
          style="width:100%;height:100%;"
        >
            <q-card-section class="text-capitalize">
              <div class="text-h6">
                <q-icon name="info"></q-icon>
                No Shared Message
              </div>
            </q-card-section>
          </q-card>
        </q-scroll-area>
      </q-card-section>
      <userDetailPlugin v-if="this.store.selecteUserProfileCompActive"/>
  </q-card>
</template>

<script>
import userDetailPlugin from 'src/profilePlugin/userDetailPlugin.vue';
import axios from 'axios'
import { useCounterStore} from 'src/stores/store';
export default {
  components:{
    userDetailPlugin
  },
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
    goDetail(data){
      console.log(data)
      const allBody = {
        selectedSharedPost:data
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postDetail._id}/checkDeletedOrNot`,allBody)
        .then(res=>{
          console.log(res)
          if(res.data.removed){
            this.$q.notify({
              type:'negative',
              icon:'info',
              message:'Post Can not found !',
              position:'right'
            })
          }else{
            this.$router.push({path:`/detailCarSalePost/${data.postDetail.postId}`})
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    deleteMessage(data){
      console.log(data)
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.sharedId}/removeFromShareds`)
        .then(res=>{
          console.log(res)
          this.store.allSharedList = this.store.allSharedList.filter(object=> object.sharedId !== data.sharedId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    showDetail(data){
      console.log(data)
      this.store.selecteUserProfile._id = this.checkSenderOrNot(data) ? data.sendedDetail._id : data.senderDetail._id
      this.store.selecteUserProfileCompActive =! this.store.selecteUserProfileCompActive
    },
    checkSenderOrNot(data){
      if(data.senderDetail._id === this.store.userDetail._id){
        return true
      }else{
        return false
      }
    }
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          const id = newValue._id
          this.store.getMyShareds(id)
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
