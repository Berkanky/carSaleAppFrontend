<template>
  <q-page class="allPage">
    <div class="" :class="this.store.mobileActive ? 'row' : 'row q-mt-sm'">
      <div :class="this.store.mobileActive ? 'col' : 'col q-pa-xs'">
        <profileSettings v-if="this.store.selectedProfileOption.value == 'profile'"/>
        <createPost v-if="this.store.selectedProfileOption.value === 'createpost'"/>
        <myCarSalesVue v-if="this.store.selectedProfileOption.value ==='showmysaleposts'"/>
        <mySharedsVue v-if="this.store.selectedProfileOption.value === 'showmyshareds'"/>
        <confirmedsVue v-if="this.store.selectedProfileOption.value === 'showmyconfirmedoffers'"/>
        <pendingOffersVue v-if="this.store.selectedProfileOption.value === 'showmypendingoffers'"/>
        <declinedsDialog v-if="this.store.selectedProfileOption.value === 'showmydeclinedoffers'"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import confirmedsVue from '../confirmeds/confirmeds.vue'
import createPost from 'src/carSaleComp/createPost.vue'
import profileSettings from 'src/profilecomp/profileSettings.vue'
import profileLists from 'src/profilecomp/profileLists.vue'
import{useCounterStore} from '../stores/store'
import myCarSalesVue from 'src/myCarSaleComp/myCarSales.vue'
import mySharedsVue from 'src/shareds/myShareds.vue'
import pendingOffersVue from 'src/pendingoffers/pendingOffers.vue'
import declinedsDialog from '../declinedOffers/declinedsDialog.vue'
export default {
  components:{
    profileSettings,
    profileLists,
    createPost,
    myCarSalesVue,
    mySharedsVue,
    confirmedsVue,
    pendingOffersVue,
    declinedsDialog
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

  },
  created(){
    this.store.getMyInfoFromMongoDb()
  },
  watch:{
    'store.mobileActive':{
      handler(newValue,oldValue){
        if(newValue === true){
          this.store.profileListsCompActive = false
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
