<template>
    <q-list class="rounded-borders text-dark" padding>
      <q-item
        clickable
        v-ripple
        :class="checkSelectedOption(data)"
        v-on:click="selectOption(data)"
        v-for="(data,key) in this.options" :key="key"
      >
        <q-item-section avatar>
          <q-icon :name="data.icon" />
        </q-item-section>
        <q-item-section>{{data.label}}</q-item-section>
      </q-item>
    </q-list>
</template>

<script>
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
      options:[
        {id:1,label:'My Profile',icon:'person',color:'primary',value:'profile'},
        {id:2,label:'Sell My Car',icon:'add',color:'white',value:'createpost'},
        {id:3,label:'My Sale Posts',icon:'filter_list',color:'white',value:'showmysaleposts'},
        {id:4,label:'Show My Shareds',icon:'share',color:'blue-4',value:'showmyshareds'},
        {id:5,label:'Show Confirmed Offers',icon:'filter_list',color:'green-4',value:'showmyconfirmedoffers'},
        {id:6,label:'Show My Pending Offers',icon:'info',color:'blue-4',value:'showmypendingoffers'},
        {id:7,label:'Show My Declined Pending Offers', icon:'info',color:'red-4',value:'showmydeclinedoffers'}
      ],
      selectedOption:{}
    }
  },
  methods:{
    checkSelectedOption(data){
      if(data.value === this.store.selectedProfileOption.value){
        return 'bg-dark text-white'
      }else{
        return 'bg-grey-4 text-dark'
      }
    },
    selectOption(data){
      this.selectedOption = data
      this.store.selectedProfileOption = data
      if(data.id === 1){
        this.store.profileListsCompActive = true
      }
    }
  },
  created(){

  },
  watch:{

  }
}
</script>

<style>

</style>
