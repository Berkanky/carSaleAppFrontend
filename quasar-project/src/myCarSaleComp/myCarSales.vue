<template>
    <q-card class="bg-grey-4 text-dark" flat bordered>
      <q-card-section>
        <div class="text-h6">
          Sales Posts
        </div>
        <div class="text-subtitle2">
          {{ this.store.userDetail.email ?? this.store.userDetail.name }}
        </div>
      </q-card-section>
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left"></th>
            <th class="text-left">Image</th>
            <th class="text-left">Brand</th>
            <th class="text-left">Title</th>
            <th class="text-left">Condition</th>
            <th class="text-left">Year</th>
            <th class="text-left"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(data,key) in this.myCarSalePosts" :key="key"
          >
            <td class="text-left">{{key}}</td>
            <td class="text-left">
              <q-avatar>
                <img
                  v-if="data.mainImage"
                  :src="data.mainImage" style="object-fit:Cover;" alt="">
              </q-avatar>
            </td>
            <td class="text-left">{{ data.brand ?? ''}}</td>
            <td class="text-left">{{ data.title ?? ''}}</td>
            <td class="text-left">{{data.condition ?? ''}}</td>
            <td class="text-left">{{ data.year ?? '' }}</td>
            <td class="text-left">
              <q-btn icon="edit" color="grey-8" v-on:click="updatePost(data)"></q-btn>
              <q-btn icon="delete_forever" color="red-4" v-on:click="deletePost(data)"></q-btn>
              <q-btn icon="verified_user" color="green-4" v-on:click="detailIfConfirmed(data)" v-if="data.confirmedSaleUser !== '' && data.confirmedSaleUser !== null"></q-btn>
              <q-btn
                :disable="data.offeredPrices.length ? false : true"
                icon="filter_list" color="orange-4" v-on:click="showAllOfferedPrices(data)"></q-btn>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <confirmedDetailDialog
        @confirmedSaleUserDetail="getconfirmedSaleUserDetail"
        v-if="this.store.confirmedSaleUserDialogActive"/>
      <offersList
        v-if="this.store.offersListDialogActive"
      />
    </q-card>
</template>

<script>
import offersList from 'src/offer/offersList.vue'
import confirmedDetailDialog from './confirmedDetailDialog.vue'
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  components:{
    confirmedDetailDialog,
    offersList
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      myCarSalePosts:[],
    }
  },
  methods:{
    showAllOfferedPrices(data){
      console.log(data)
      this.store.forOfferedListSelectedSalePost.postId = data.postId
      this.store.offersListDialogActive =! this.store.offersListDialogActive
    },
    getconfirmedSaleUserDetail(data){
      if(data){
        const result = this.myCarSalePosts.find(object => object.postId === data.postId)
        if(result){
          result.confirmedSaleUser = ''
        }
      }
    },
    detailIfConfirmed(data){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/getSelectedPostConfirmedDetail`)
        .then(res=>{
          console.log(res)
          this.store.confirmedSaleUserDialogActive =! this.store.confirmedSaleUserDialogActive
          if(res.data.confirmedSaleUserDetail && res.data.confirmedSaleUserDetail.userDetail && res.data.confirmedSaleUserDetail.priceDetail){
            this.store.confirmedSaleUserDetail = res.data.confirmedSaleUserDetail
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    updatePost(data){
      console.log(data)
      this.$router.push({path:`/updateSalePost/${data.postId}`})

    },
    deletePost(data){
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/removeMyCarSalePost`)
        .then(res=>{
          console.log(res)
          this.myCarSalePosts = this.myCarSalePosts.filter(object => object.postId !== data.postId)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    getMyCarSalePosts(){
      axios.get(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/getMyCarSalePost`)
        .then(res=>{
          console.log('myCarSalePostsres',res)
          this.myCarSalePosts = res.data.newList
          console.log('myCarSalePosts',this.myCarSalePosts)
        })
        .catch(err=>{
          console.log(err)
        })
    }
  },
  created(){
    this.getMyCarSalePosts()
  },
  watch:{

  }
}
</script>

<style>

</style>
