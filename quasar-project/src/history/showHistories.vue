<template>
  <q-dialog
    v-model="this.store.showHistoryDialogActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'right'"
  >
    <q-card
      class="text-dark"
      :style="{
        'width':this.store.mobileActive ? '100%' : '550px',
        'max-width':this.store.mobileActive ? '100%' : '550px'
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="dark" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn icon="clear_all" flat color="red-4" v-on:click="clearAll" v-if="this.store.myAllVisitsListWithDetail.length"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-card v-if="!this.store.myAllVisitsListWithDetail.length">
          <q-card-section class="text-dark text-subtitle2">
            <q-icon name="info"></q-icon>
            Nothing Here ! Visit Some Car Sales
          </q-card-section>
        </q-card>
        <q-card
          v-for="(data,key) in this.store.myAllVisitsListWithDetail" :key="key"
          class="my-card" flat bordered>
          <q-img
            loading="lazy"
            spinner-color="white"
            :src="data.postDetail.mainImage" v-if="data.postDetail.mainImage" />
          <q-card-section>
            <q-btn
              fab
              v-on:click="removeFromVisits(data)"
              color="red-4"
              icon="delete_forever"
              class="absolute"
              style="top: 0; left: 12px; transform: translateY(-50%);"
            />
            <q-btn
              fab
              v-on:click="goDetail(data)"
              color="blue-4"
              icon="login"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            />
            <div class="row no-wrap items-center q-mt-md">
              <div class="col text-h6 ellipsis">
                {{data.postDetail.title ?? 'No Title'}}
              </div>
              <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
                <q-icon name="event" />
                {{data.postDetail.date ?? ''}}
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <div class="text-subtitle1 text-capitalize">
             {{data.postDetail.brand ?? ''}}, {{ data.postDetail.model ?? '' }} {{ data.postDetail.year ?? '' }}
            </div>
            <div class="text-caption text-grey">
              {{data.postDetail.description ?? 'No Description'}}
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
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

    }
  },
  methods:{
    clearAll(){
      const allBody = {
        deleteList:this.store.myAllVisitsListWithDetail
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/removeAllFromVisits`,allBody)
        .then(res=>{
          console.log(res)
          this.store.myAllVisitsListWithDetail = []
          this.store.myAllVisits = []
          this.store.showHistoryDialogActive =! tihs.store.showHistoryDialogActive
        })
        .catch(err=>{
          console.log(err)
        })
    },
    removeFromVisits(data){
      console.log(data)
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.visitId}/removeFromVisits`)
        .then(res=>{
          console.log(res)
          this.store.myAllVisitsListWithDetail = this.store.myAllVisitsListWithDetail.filter(object => object.visitId !== data.visitId)
          this.store.myAllVisits = this.store.myAllVisits.filter(object => object.visitId !== data.visitId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goDetail(data){
      this.$router.push({path:`/detailCarSalePost/${data.postDetail.postId}`})
      this.store.showHistoryDialogActive =! this.store.showHistoryDialogActive
    },
    goBack(){
      this.store.showHistoryDialogActive =! this.store.showHistoryDialogActive
    }
  },
  created(){

  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getMyAllVisitsWithDetails()
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
