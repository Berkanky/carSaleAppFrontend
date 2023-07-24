<template>
  <q-card class="bg-transparent ">
    <q-btn-dropdown
      split
      color="blue-4"
      push
      no-caps
      class="full-width"
      icon="settings"
      :label="this.store.carsPageFilterData.brand ?? 'Select Brand'"
      @click="onMainClick"
    >
      <q-list class="bg-dark text-white">
        <q-item
          v-for="(data,key) in this.store.brandList" :key="key"
          clickable v-close-popup @click="selectBrand(data)">
          <q-item-section avatar>
            <q-avatar icon="info" color="dark" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{data.name}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-btn-dropdown
      :disable="this.store.carsPageFilterData.brand ? false : true"
      split
      color="orange-4"
      push
      no-caps
      class="full-width q-mt-xs"
      icon="settings"
      :label="this.store.carsPageFilterData.model ?? 'Select Model'"
      @click="onMainClick"
    >
      <q-list class="bg-dark text-white">
        <q-item
          v-for="(data,key) in this.store.modelList" :key="key"
          clickable v-close-popup @click="selectModel(data)">
          <q-item-section avatar>
            <q-avatar icon="info" color="dark" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{data}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.year ?? 'Year'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.yearActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.yearActive"
          v-model="this.dialogOptions.yearActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row">
              <q-input
                color="dark"
                filled
                class="col"
                label="Select Year"
                type="number"
                v-model="this.store.carsPageFilterData.year"
              ></q-input>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.yearActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.yearActive = false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs ">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.priceMinMax.minPrice && this.store.priceMinMax.maxPrice ? `${this.store.priceMinMax.minPrice} - ${this.store.priceMinMax.maxPrice}` : 'Price'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.priceActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.priceActive"
          v-model="this.dialogOptions.priceActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row">
              <q-input
                color="dark"
                filled
                class="col"
                label="Min Price"
                type="number"
                v-model="this.store.priceMinMax.minPrice"
              ></q-input>
              <q-input
                color="dark"
                filled
                class="col"
                label="Max Price"
                type="number"
                v-model="this.store.priceMinMax.maxPrice"
              ></q-input>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.priceActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.priceActive=false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.transmission ?? 'Transmission'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.transmissionActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.transmissionActive"
          v-model="this.dialogOptions.transmissionActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row">
              <q-radio
                color="blue-4"
                v-for="(data,key) in this.store.transmissionOption"
                :key="key" :label="data" class="col"
                v-on:click="this.dialogOptions.transmissionActive=false"
                v-model="this.store.carsPageFilterData.transmission" :val="data" />
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.transmissionActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="console.log(this.store.carsPageFilterData)"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          Kilometres - ( {{ this.store.kilometresMinMax.minKm ?? '' }} - {{ this.store.kilometresMinMax.maxKm ?? '' }} )
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:Click="this.dialogOptions.kilometresActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.kilometresActive"
          v-model="this.dialogOptions.kilometresActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row">
              <q-input
                color="dark"
                filled
                class="col"
                label="Min KM"
                type="number"
                v-model="this.store.kilometresMinMax.minKm"
              ></q-input>
              <q-input
                color="dark"
                filled
                class="col"
                label="Max KM"
                type="number"
                v-model="this.store.kilometresMinMax.maxKm"
              ></q-input>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.kilometresActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.kilometresActive = false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">{{this.store.carsPageFilterData.bodyType ?? 'Body Type'}}</div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.bodyTypeActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.bodyTypeActive"
          v-model="this.dialogOptions.bodyTypeActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row">
              <q-card
                v-on:click="this.store.carsPageFilterData.bodyType = data;this.dialogOptions.bodyTypeActive = false"
                v-for="(data,key) in this.store.bodyOption" :key="key"
                style="height:120px;" class="col-4 text-dark q-mt-xs">
                <q-btn class="full-width full-height" :label="data" no-caps></q-btn>
              </q-card>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.bodyTypeActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="console.log(this.store.carsPageFilterData)"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.condition ?? 'Condition'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.conditionActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.conditionActive"
          v-model="this.dialogOptions.conditionActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row">
              <q-radio
                color="blue-4"
                v-for="(data,key) in this.store.conditionOption"
                :key="key" :label="data" class="col"
                v-on:click="this.dialogOptions.conditionActive=false"
                v-model="this.store.carsPageFilterData.condition" :val="data" />
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.conditionActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.conditionActive = false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.fuelType ?? 'Fuel Type'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.fuelTypeActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.fuelTypeActive"
          v-model="this.dialogOptions.fuelTypeActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="row ">
              <q-radio
                color="blue-4"
                v-for="(data,key) in this.store.fuelTypeOption"
                :key="key" :label="data" class="col"
                v-on:click="this.dialogOptions.fuelTypeActive=false"
                v-model="this.store.carsPageFilterData.fuelType" :val="data" />
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.fuelTypeActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.fuelTypeActive = false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.driveTrain ?? 'Drive Train'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.driveTrainTypeActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.driveTrainTypeActive"
          v-model="this.dialogOptions.driveTrainTypeActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="">
              <q-radio
                color="blue-4"
                v-for="(data,key) in this.store.driveTrainOptions"
                :key="key" :label="data" class="col"
                v-on:click="this.dialogOptions.driveTrainTypeActive=false"
                v-model="this.store.carsPageFilterData.driveTrain" :val="data" />
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.driveTrainTypeActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.driveTrainTypeActive = false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.sellerType ?? 'Seller Type'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.sellerTypeActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.sellerTypeActive"
          v-model="this.dialogOptions.sellerTypeActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="">
              <q-radio
                color="blue-4"
                v-for="(data,key) in this.store.sellerTypeOptions"
                :key="key" :label="data" class="col"
                v-on:click="this.dialogOptions.sellerTypeActive=false"
                v-model="this.store.carsPageFilterData.sellerType" :val="data" />
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.sellerTypeActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.sellerTypeActive = false"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.exteriorColor ?? 'Exterior Color'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.store.colorCompActive = true"></q-btn>
        <colorOptionComp v-if="this.store.colorCompActive" @carDataColor="getcarDataColor"/>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.cylinders ?? 'Number Of Cylinders'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.cylindersActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.cylindersActive"
          v-model="this.dialogOptions.cylindersActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="">
              <q-select
                color="dark"
                filled class="q-pa-md" label="Select Cylinder Type"
                :options="this.store.cylindersOptions" v-model="this.store.carsPageFilterData.cylinders"></q-select>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.cylindersActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.cylindersActive = false;console.log(this.store.carsPageFilterData)"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.engineSize ?? 'Engine Size'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.engineSizeActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.engineSizeActive"
          v-model="this.dialogOptions.engineSizeActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="">
              <q-select
                color="dark"
                filled class="q-pa-md" label="Select Engine Size"
                :options="this.store.engineSizeOptions" v-model="this.store.carsPageFilterData.engineSize"></q-select>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.engineSizeActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.engineSizeActive = false;console.log(this.store.carsPageFilterData)"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs">
      <q-card-section class="row text-dark">
        <div class="text-subtitle2 text-weight-bold q-pa-sm">
          {{this.store.carsPageFilterData.doors ?? 'Door Type'}}
        </div>
        <q-space></q-space>
        <q-btn icon="add" flat color="dark" v-on:click="this.dialogOptions.doorOptionsActive = true"></q-btn>
        <q-dialog
          v-if="this.dialogOptions.doorOptionsActive"
          v-model="this.dialogOptions.doorOptionsActive"
          persistent
          :maximized="this.store.mobileActive ? true : false"
          :full-height="this.store.mobileActive ? true : false"
        >
          <q-card
            :style="{'width':this.store.mobileActive ? '100%' : '400px'}"
          >
            <q-card-section class="">
              <q-select
                color="dark"
                filled class="q-pa-md" label="Select Door Type"
                :options="this.store.doorOptions" v-model="this.store.carsPageFilterData.doors"></q-select>
            </q-card-section>
            <q-card-section class="row">
              <q-btn label="Cancel" no-caps flat color="primary" class="col-6" v-on:click="this.dialogOptions.doorOptionsActive = false"></q-btn>
              <q-btn label="Confirm" no-caps color="primary" class="col-6" v-on:click="this.dialogOptions.doorOptionsActive = false;console.log(this.store.carsPageFilterData)"></q-btn>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card-section>
    </q-card>
    <q-card flat class="bg-transparent q-mt-xs" v-if="this.checkStorecarsPageFilterData()">
      <q-card-section horizontal>
        <q-btn
          class="col" color="red" flat label="Clear"
          v-on:click="clearAll"
        ></q-btn>
        <q-btn
          v-on:click="getResult"
          class="col" color="green-4" label="Results"
        ></q-btn>
      </q-card-section>
    </q-card>
  </q-card>
</template>

<script>
import axios from 'axios'
import colorOptionComp from 'src/carSaleComp/colorOptionComp.vue';
import { useCounterStore } from '../stores/store';
export default {
  components:{
    colorOptionComp
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      dialogOptions:{
      },

    }
  },
  methods:{
    getResult(){
      const newData = {
        filterData : this.store.carsPageFilterData,
        priceMinMax:this.store.priceMinMax,
        kilometresMinMax:this.store.kilometresMinMax,
        location:this.store.locationFilterData
      }
      axios.put(`${this.store.baseUrl}/carapp/${this.store.userDetail._id}/filterInCarsPage`,newData)
        .then(res=>{
          console.log(res)
          if(res.data.message){
            this.$q.notify({
              type:'negative',
              position:'top',
              message:'No Result, Try Again',
              timeout:700
            })
            this.clearAll()
          }else if(!res.data.message){
            this.store.filteredList = res.data.filteredList
            this.store.filterBody = res.data.filterBody
            this.store.allCarSalePosts = res.data.allCarSalePosts
          }
        })
        .catch(err=>{
          console.log(err)
        })
    },
    clearAll(){
      this.store.carsPageFilterData = {}
      this.store.priceMinMax = {}
      this.store.kilometresMinMax = {}

      this.store.filteredList = []
      this.store.filterBody = {}
    },
    checkStorecarsPageFilterData(){
      const kilometresval = Object.values(this.store.kilometresMinMax).length
      const priceval = Object.values(this.store.priceMinMax).length
      const val = Object.values(this.store.carsPageFilterData).length
      if(val > 0 || priceval > 0 || kilometresval > 0){
        return true
      }else{
        return false
      }
    },
    getcarDataColor(data){
      if(data){
        this.store.carsPageFilterData.exteriorColor = data
        this.store.colorCompActive = false
        console.log('carData',this.store.carsPageFilterData)
      }
    },
    selectModel(data){
      console.log(data)
      this.store.carsPageFilterData.model = data
    },
    selectBrand(data){
      this.store.carsPageFilterData.brand = data.name
      const carData  = data.name
      this.store.getModels(carData)
    }
  },
  created(){
    this.store.getManufacturer()
  },
  watch:{

  }
}
</script>

<style>

</style>
