<template>
  <q-dialog
    v-model="this.store.colorCompActive"
    persistent :maximized="this.store.mobileActive ? true : false"
    :full-height="this.store.mobileActive ? true : false"
  >
    <q-card>
      <q-card-section class="row">
        <div class="text-subtitle2 text-weight-bold text-dark">
          Exterior Color
        </div>
        <q-space></q-space>
        <div class="text-subtitle2 text-grey-5">
          Clear
        </div>
      </q-card-section>
      <q-card-section class="row">
        <q-card
          v-on:click="selectColor(data)"
          v-for="(data,key) in this.store.colorOptions" :key="key"
          style="height:150px;" class="col-6 col-md-4 col-sm-4 q-mt-xs" >
          <q-btn
            :color="data === 'white' ? 'dark' : data" flat
            icon="fiber_manual_record"
            :label="data"
            class="full-height full-width"
          ></q-btn>
        </q-card>
      </q-card-section>
      <q-card-section class="row">
        <q-btn label="cancel" no-caps class="col-6"  v-on:click="goBack" flat color="primary"></q-btn>
        <q-btn label="results" no-caps class="col-6" color="primary"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useCounterStore } from '../stores/store';
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
    goBack(){
      this.store.colorCompActive = false
    },
    selectColor(data){
      this.$emit('carDataColor',data)
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
