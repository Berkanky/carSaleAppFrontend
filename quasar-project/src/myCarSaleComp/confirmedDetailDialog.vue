<template>
  <q-dialog
    v-model="this.store.confirmedSaleUserDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'top'"
    persistent
  >
    <q-card
      class="bg-dark text-dark"
      :style="{
      'width':this.store.mobileActive ? '100%' : '550px',
      'max-width':this.store.mobileActive ? '100%' : '550px'
    }">
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-card class="my-card" flat bordered>
          <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-btn
              v-if="!this.store.confirmedSaleUserDetail.userDetail.userImage"
              color="dark" round
              icon="person"
            ></q-btn>
            <img
              v-if="this.store.confirmedSaleUserDetail.userDetail.userImage"
              style="object-fit:cover;"
              :src="this.store.confirmedSaleUserDetail.userDetail.userImage">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-icon name="email" color="grey-6"></q-icon>
            {{this.store.confirmedSaleUserDetail.userDetail.email ?? this.store.confirmedSaleUserDetail.userDetail.name}}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="work" color="grey-6"></q-icon>
            {{this.store.confirmedSaleUserDetail.userDetail.job ?? 'No Info'}}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs col-7">
          <div class="text-overline">Sale Post</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{this.store.confirmedSaleUserDetail.postDetail.title ?? ''}}</div>
          <div class="text-caption text-grey">
            {{this.store.confirmedSaleUserDetail.postDetail.description ?? 'No Info'}}
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            style="object-fit:cover;"
            v-if="this.store.confirmedSaleUserDetail.postDetail.mainImage"
            :src="this.store.confirmedSaleUserDetail.postDetail.mainImage"
          />
        </q-card-section>
      </q-card-section>
      <q-separator />
      <q-card-setcion class="text-subtitle2 row">
        <div class="col q-pa-md">
          <q-icon name="info" color="grey-6"></q-icon>
          Price :
        </div>
        <div class="col q-pa-md">
          {{this.store.confirmedSaleUserDetail.priceDetail.price ?? 'No Price Info'}}
          <q-icon name="attach_money" color="dark"></q-icon>
        </div>
      </q-card-setcion>
      <q-card-actions class="row">
        <q-btn icon="delete_forever" color="red-4" label="Cancel Confirm" no-caps class="col" v-on:click="deleteConfirmed"></q-btn>
      </q-card-actions>
    </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useCounterStore } from 'src/stores/store';
import axios from 'axios'
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
    deleteConfirmed(){
      this.$q.dialog({
        dark:true,
        cancel:true,
        title:'Warning',
        message:`${this.store.confirmedSaleUserDetail.userDetail.email ?? this.store.confirmedSaleUserDetail.userDetail.name} User Offer Will Be Canceled, You Sure ?`,
      }).onOk(()=>{
        axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/${this.store.confirmedSaleUserDetail.postDetail.postId}/removeConfirmedSaleUser`)
          .then(res=>{
            console.log(res)
            if(res.data.removed && res.data.removed === true){
              this.store.confirmedSaleUserDetail.postDetail.confirmedSaleUser = ''
              this.$emit('confirmedSaleUserDetail',this.store.confirmedSaleUserDetail.postDetail)
              this.store.confirmedSaleUserDialogActive =! this.store.confirmedSaleUserDialogActive
            }
          })
          .catch(err=>{
            console.log(err)
          })
      })
    },
    goBack(){
      this.store.confirmedSaleUserDialogActive =! this.store.confirmedSaleUserDialogActive
    }
  },
  created(){

  },
  watch:{
    'store.confirmedSaleUserDetail':{
      handler(newValue,oldValue){
        if(newValue){
          console.log('confirmedSaleUserDetail',newValue)
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
