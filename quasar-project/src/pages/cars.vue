<template>
  <q-page>
    <div class="row">
      <div class="col-3">
        <q-card
          class="bg-grey-3"
        >
          <q-card-section class="row text-dark">
            <div class="text-subtitle2 text-weight-bold">
              Filter
            </div>
            <q-space></q-space>
            <div
              v-on:click="clearAllFilter"
              class="text-subtitle2 text-primary text-weight-bold" style="cursor:grab;">
              Clear Filter
            </div>
          </q-card-section>
          <q-card-section>
            <q-scroll-area
              :style="{'height':this.$q.screen.height + 'px'}"
              style="width:100%;"
            >
            <filterCompVue />
          </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
      <div class="col">
        <q-card class="bg-grey-3 text-dark">
          <q-card-section horizontal>
            <q-card-section class="col-4 text-left">
              <div class="text-subtitle2 text-weight-bold">
                {{ this.store.filteredList.length ? this.store.filteredList.length : this.store.allCarSalePosts.length }} Car On Sale.
              </div>
            </q-card-section>
            <q-card-section class="col-4 text-center">
              <q-card flat>
                <q-card-section horizontal>
                  <q-btn
                    :flat="this.listType === 'Gallery List' ? true : false"
                    class="col-6" label="Gallery List" icon="collections_bookmark" size="sm"
                    v-on:click="this.listType = 'Gallery List'"></q-btn>
                  <q-btn
                    :flat="this.listType === 'Gallery List' ? false : true"
                    class="col-6" label="View List" icon="view_list" size="sm"
                    v-on:click="this.listType = 'View List'"
                    ></q-btn>
                </q-card-section>
              </q-card>
            </q-card-section>
            <q-card-section class="col-4 text-right">
              <q-btn icon="history" flat color="dark" v-on:click="showHistory">
                <q-badge floating color="red" rounded />
              </q-btn>
            </q-card-section>
          </q-card-section>
          <q-scroll-area style="width:100%;" :style="{'height':this.$q.screen.height + 'px'}">
          <q-card-section class="row" v-if="!this.store.filteredList.length">
            <q-card
              class="q-mt-xs"
              v-for="(data,key) in this.store.allCarSalePosts" :key="key"
              :class="this.checkListType() ? 'col-12 col-md-4 col-sm-4' : 'col-12'"

              >
              <q-img
                v-if="this.checkListType()"
                style="object-fit:cover;height:200px;"
                loading="lazy"
                spinner-color="white"
                :src="data.mainImage" ></q-img>
                <q-card-section v-if="this.checkListType()" class="col">
                  <q-card-section class="text-left text-capitalize">
                    <div class="text-caption text-grey-5 text-weight-bold" v-if="this.checkVisitedOrNot(data)">
                      <q-icon name="info"></q-icon>
                      {{ this.messageIfVisited(data) }}
                    </div>
                    <div class="text-h6">
                      {{ data.price ?? '' }} $
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-subtitle2 text-capitalize text-weight-bold">
                        <q-icon name="local_taxi" color="grey-5"></q-icon>
                        {{ data.description ?? '' }}
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="speed" color="grey-5"></q-icon>
                      {{ data.kilometres ?? 'NaN' }} Km
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="location_on" color="grey-5"></q-icon>
                      {{ data.location.country ?? 'NaN' }}, {{ data.location.city ?? 'NaN' }}
                    </div>
                  </q-card-section>
                  <q-separator color="grey-4" size="2px"></q-separator>
                  <q-card-section class="row">
                    <q-btn icon="info" flat color="grey-7" label="Details" no-caps size="sm" v-on:click="goDetail(data)"></q-btn>
                    <q-space></q-space>
                    <q-btn :icon="this.checkSavedOrNot(data) ? 'bookmark_remove' : 'bookmark_add'" flat :color="this.checkSavedOrNot(data) ? 'red-4' : 'blue-4'" no-caps :label="this.checkSavedOrNot(data) ? 'Remove' : 'Save'" size="sm" v-on:Click="savePost(data)"></q-btn>
                  </q-card-section>
                </q-card-section>
                <q-card-section horizontal v-if="!this.checkListType()">
                  <q-img
                v-if="!this.checkListType()"
                :style="{'height':this.checkListType() ? '200px' : '245px'}"
                loading="lazy"
                class="col-4"
                spinner-color="white"
                :src="data.mainImage" ></q-img>
                <q-card-section v-if="!this.checkListType()" class="col">
                  <q-card-section class="text-left text-capitalize">
                    <div class="text-caption text-grey-5 text-weight-bold" v-if="this.checkVisitedOrNot(data)">
                      <q-icon name="info"></q-icon>
                      {{ this.messageIfVisited(data) }}
                    </div>
                    <div class="text-h6">
                      {{ data.price ?? '' }} $
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-subtitle2 text-capitalize text-weight-bold">
                        <q-icon name="local_taxi" color="grey-5"></q-icon>
                        {{ data.description ?? '' }}
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="speed" color="grey-5"></q-icon>
                      {{ data.kilometres ?? 'NaN' }} Km
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="location_on" color="grey-5"></q-icon>
                      {{ data.location.country ?? 'NaN' }}, {{ data.location.city ?? 'NaN' }}
                    </div>
                    <q-separator color="grey-4" size="2px"></q-separator>
                  <q-card-section class="row">
                    <q-btn icon="info" flat color="grey-7" label="Details" no-caps size="sm" v-on:click="goDetail(data)"></q-btn>
                    <q-space></q-space>
                    <q-btn :icon="this.checkSavedOrNot(data) ? 'bookmark_remove' : 'bookmark_add'" flat :color="this.checkSavedOrNot(data) ? 'red-4' : 'blue-4'" no-caps :label="this.checkSavedOrNot(data) ? 'Remove' : 'Save'" size="sm" v-on:Click="savePost(data)"></q-btn>
                  </q-card-section>
                  </q-card-section>
                  <q-card-section class="row" v-if="this.checkListType()">
                    <q-btn icon="info" flat color="grey-7" label="Details" no-caps size="sm" v-on:click="goDetail(data)"></q-btn>
                    <q-space></q-space>
                    <q-btn :icon="this.checkSavedOrNot(data) ? 'bookmark_remove' : 'bookmark_add'" flat :color="this.checkSavedOrNot(data) ? 'red-4' : 'blue-4'" no-caps :label="this.checkSavedOrNot(data) ? 'Remove' : 'Save'" size="sm" v-on:Click="savePost(data)"></q-btn>
                  </q-card-section>
                </q-card-section>
                </q-card-section>
            </q-card>
          </q-card-section>
          <q-card-section class="row" v-if="this.store.filteredList.length">
            <q-card
              class="q-mt-xs"
              v-for="(data,key) in this.store.filteredList" :key="key"
              :class="this.checkListType() ? 'col-12 col-md-4 col-sm-4' : 'col-12'"

              >
              <q-img
                v-if="this.checkListType()"
                style="object-fit:cover;height:200px;"
                loading="lazy"
                spinner-color="white"
                :src="data.mainImage" ></q-img>
                <q-card-section v-if="this.checkListType()" class="col">
                  <q-card-section class="text-left text-capitalize">
                    <div class="text-caption text-grey-5 text-weight-bold" v-if="this.checkVisitedOrNot(data)">
                      <q-icon name="info"></q-icon>
                      {{ this.messageIfVisited(data) }}
                    </div>
                    <div class="text-h6">
                      {{ data.price ?? '' }} $
                    </div>
                    <div class="text-h6">
                      {{ data.price ?? '' }} $
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-subtitle2 text-capitalize text-weight-bold">
                        <q-icon name="local_taxi" color="grey-5"></q-icon>
                        {{ data.description ?? '' }}
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="speed" color="grey-5"></q-icon>
                      {{ data.kilometres ?? 'NaN' }} Km
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="location_on" color="grey-5"></q-icon>
                      {{ data.location.country ?? 'NaN' }}, {{ data.location.city ?? 'NaN' }}
                    </div>
                  </q-card-section>
                  <q-separator color="grey-4" size="2px"></q-separator>
                  <q-card-section class="row">
                    <q-btn icon="info" flat color="grey-7" label="Details" no-caps size="sm" v-on:click="goDetail(data)"></q-btn>
                    <q-space></q-space>
                    <q-btn :icon="this.checkSavedOrNot(data) ? 'bookmark_remove' : 'bookmark_add'" flat :color="this.checkSavedOrNot(data) ? 'red-4' : 'blue-4'" no-caps :label="this.checkSavedOrNot(data) ? 'Remove' : 'Save'" size="sm" v-on:Click="savePost(data)"></q-btn>
                  </q-card-section>
                </q-card-section>
                <q-card-section horizontal v-if="!this.checkListType()">
                  <q-img
                v-if="!this.checkListType()"
                :style="{'height':this.checkListType() ? '200px' : '245px'}"
                loading="lazy"
                class="col-4"
                spinner-color="white"
                :src="data.mainImage" ></q-img>
                <q-card-section v-if="!this.checkListType()" class="col">
                  <q-card-section class="text-left text-capitalize">
                    <div class="text-caption text-grey-5 text-weight-bold" v-if="this.checkVisitedOrNot(data)">
                      <q-icon name="info"></q-icon>
                      {{ this.messageIfVisited(data) }}
                    </div>
                    <div class="text-h6">
                      {{ data.price ?? '' }} $
                    </div>
                  </q-card-section>
                  <q-card-section>
                    <div class="text-subtitle2 text-capitalize text-weight-bold">
                        <q-icon name="local_taxi" color="grey-5"></q-icon>
                        {{ data.description ?? '' }}
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="speed" color="grey-5"></q-icon>
                      {{ data.kilometres ?? 'NaN' }} Km
                    </div>
                    <div class="text-subtitle2 text-capitalize">
                      <q-icon name="location_on" color="grey-5"></q-icon>
                      {{ data.location.country ?? 'NaN' }}, {{ data.location.city ?? 'NaN' }}
                    </div>
                    <q-separator color="grey-4" size="2px"></q-separator>
                  <q-card-section class="row">
                    <q-btn icon="info" flat color="grey-7" label="Details" no-caps size="sm" v-on:click="goDetail(data)"></q-btn>
                    <q-space></q-space>
                    <q-btn :icon="this.checkSavedOrNot(data) ? 'bookmark_remove' : 'bookmark_add'" flat :color="this.checkSavedOrNot(data) ? 'red-4' : 'blue-4'" no-caps :label="this.checkSavedOrNot(data) ? 'Remove' : 'Save'" size="sm" v-on:Click="savePost(data)"></q-btn>
                  </q-card-section>
                  </q-card-section>
                  <q-card-section class="row" v-if="this.checkListType()">
                    <q-btn icon="info" flat color="grey-7" label="Details" no-caps size="sm" v-on:click="goDetail(data)"></q-btn>
                    <q-space></q-space>
                    <q-btn :icon="this.checkSavedOrNot(data) ? 'bookmark_remove' : 'bookmark_add'" flat :color="this.checkSavedOrNot(data) ? 'red-4' : 'blue-4'" no-caps :label="this.checkSavedOrNot(data) ? 'Remove' : 'Save'" size="sm" v-on:Click="savePost(data)"></q-btn>
                  </q-card-section>
                </q-card-section>
                </q-card-section>
            </q-card>
          </q-card-section>
        </q-scroll-area>
        </q-card>
      </div>
    </div>
    <showHistoriesVue v-if="this.store.showHistoryDialogActive"/>
  </q-page>
</template>

<script>
import axios from 'axios'
import filterCompVue from 'src/carsPageComponents.vue/filterComp.vue'
import{useCounterStore} from '../stores/store'
import showHistoriesVue from 'src/history/showHistories.vue'
export default {
  components:{
    filterCompVue,
    showHistoriesVue
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      listType:'Gallery List'
    }
  },
  methods:{
    showHistory(){
      this.store.showHistoryDialogActive =! this.store.showHistoryDialogActive
    },
    messageIfVisited(data){
      const result = this.store.myAllVisits.find(object => object.postId === data.postId)
      if(result){
        const message = result.date  + ' ' + 'Visited'
        return message
      }else{
        return
      }
    },
    checkVisitedOrNot(data){
      const result = this.store.myAllVisits.some(object => object.postId === data.postId)
      if(result){
        return true
      }else{
        return false
      }
    },
    addToVisits(data){
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${data.postId}/addToMyVisits`)
        .then(res=>{
          console.log(res)
        })
        .catch(err=>{
          console.log(err)
        })
    },
    goDetail(data){
      console.log(data)
      this.addToVisits(data)
      this.$router.push({path:`/detailCarSalePost/${data.postId}`})
    },
    checkSavedOrNot(data){
      const result = this.store.mySavedPostsList.some(object => object.postId === data.postId)
      if(result){
        return true
      }else{
        return false
      }
    },
    savePost(data){
      console.log(data)
      const currentData = data
      axios.post(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/addMySavedPostsList`,currentData)
        .then(res=>{
          console.log(res)
          if(res.data.removed){
            this.store.mySavedPostsList = this.store.mySavedPostsList.filter(object => object.postId !== data.postId)
          }else{
            this.store.mySavedPostsList.push(data)
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    checkListType(){
      if(this.listType === 'Gallery List'){
        return true
      }else{
        return false
      }
    },
    clearAllFilter(){
      this.store.carsPageFilterData = {}
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
          this.store.getMyAllVisits()
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
