<template>
  <q-page class="bg-grey-2">
    <q-card
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '70%'
      }"
      class="text-dark text-capitalize bg-grey-2" bordered>
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" label="back" no-caps flat color="dark" v-on:click="goBeforePage"></q-btn>
        <q-space></q-space>
        <div class="text-subtitle2 text-weight-bold q-pa-md">
          <q-icon name="favorite"></q-icon>
          My favorites
        </div>
      </q-card-section>
      <q-card-section class="row" :style="{'width':this.store.mobileActive ? '100%' : '40%'}">
        <q-btn
          class="col"
          v-on:click="this.selectedOption = 'favourite'"
          icon="favorite" label="Favourite Ads" no-caps :color="this.checkSelectedOption() ? 'green-4 ' : 'grey'"></q-btn>
        <q-btn
          class="col"
          v-on:click="this.selectedOption = 'saveds'"
          icon="bookmark" label="Favourite Ads" no-caps :color="this.checkSelectedOption() ? 'grey ' : 'green-4'"></q-btn>
      </q-card-section>
      <q-card-section class="text-subtitle2 text-weight-bold">
        <q-icon name="list" size="19px" color="grey-7"></q-icon>
        Results - {{ this.store.mySavedPostsList.length ?? 0 }}
      </q-card-section>
      <q-card-section>
        <q-markup-table>
        <thead>
          <tr>
            <th class="text-center"></th>
            <th class="text-center">Title</th>
            <th class="text-center">Price</th>
            <th class="text-center">Posted</th>
            <th class="text-center">Active</th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="this.store.mySavedPostsList.length"
            v-for="(data,key) in this.store.mySavedPostsList" :key="key"
          >
            <td class="text-center">
              {{ !data.mainImage ? 'No Image' : '' }}
              <q-img
                class="q-pa-lg"
                v-if="data.mainImage"
                :src="data.mainImage"
                style="object-fit:cover;"
              ></q-img>
            </td>
            <td class="text-center">{{data.title ?? ''}}</td>
            <td class="text-center">{{ data.price ?? '' }} $</td>
            <td class="text-center">{{ data.date ?? '' }}</td>
            <td class="text-center">
              <q-icon
                :color="this.checkStillActiveOrNot(data) ? 'green-4' : 'red-4'"
                name="info" size="17px"></q-icon>
              {{ this.checkStillActiveOrNot(data) ? 'Still Posted' : 'Deleted'}}</td>
            <td class="text-center">
              <q-btn
                v-on:click="goDetail(data)"
                icon="login"
                :color="this.checkStillActiveOrNot(data) ? 'green-4' : 'red-4'"
                flat></q-btn>
              <q-btn icon="delete_forever" flat color="red" v-on:click="removeFromMySavedList(data)"></q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
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
      selectedOption:'favourite'
    }
  },
  methods:{
    goDetail(data){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/checkInAllSalePost`)
        .then(res=>{
          console.log(res)
          if(!res.data.removed){
            this.$router.push({path:`/detailCarSalePost/${data.postId}`})
          }else{
            this.$q.notify({
              type:'negative',
              timeout:700,
              message:`${data.postId} ID Deleted !`,
              position:'right'
            })
            this.$q.dialog({
              dark:true,
              cancel:true,
              title:'Warning',
              message:'You Want To Remove From Saveds ?'
            }).onOk(() =>{
              axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/removeFromSavedsAfterCheck`)
                .then(res=>{
                  console.log(res)
                  this.store.mySavedPostsList = this.store.mySavedPostsList.filter(object => object.postId !== data.postId)
                })
                .catch(err=>{
                  console.log(err)

                })
            })
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goBeforePage(){
      this.$router.go(-1)
    },
    removeFromMySavedList(data){
      const postData = data
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/addMySavedPostsList`,postData)
        .then(res=>{
          console.log(res)
          this.store.mySavedPostsList = this.store.mySavedPostsList.filter(object => object.postId !== data.postId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkStillActiveOrNot(data){
      const result = this.store.allCarSalePosts.some(object => object.postId === data.postId)
      if(result){
        return true
      }else{
        return false
      }
    },
    checkSelectedOption(){
      if(this.selectedOption === 'favourite'){
        return true
      }else{
        return false
      }
    }
  },
  created(){
    this.store.getAllPosts()
  },
  watch:{
    'store.userDetail':{
      handler(newValue,oldValue){
        if(newValue._id){
          this.store.getMySavedPosts()
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
