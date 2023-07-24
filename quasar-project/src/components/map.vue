<template>
<div style="width: 100%; height: 400px; position: relative;">
  <l-map ref="map" v-model:zoom="zoom" :center="this.latLng.length ? this.latLng : [47.41322, -1.219482]">
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    ></l-tile-layer>
    <l-marker 
      @dragend="onChangeLocation"
      :draggable="true"
      :lat-lng="this.latLng"
      v-if="this.latLng.length"
    ></l-marker>
  </l-map>
  <q-btn
    icon="location_on"
    color="green"
    glossy
    round
    v-on:click="getCurrentLocation()"
    style="position: absolute; top: 10px; right: 10px;"
  ></q-btn>
</div>

</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import {useCounterStore} from '../stores/store'
export default {
  components:{
    LMap,
    LTileLayer,
    LMarker
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      zoom: 15,
      currentLocation:{},
      latLng:[],
      

    }
  },
  methods:{
    async getSelectedLocationInformations(newLocation){
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${newLocation.lat}+${newLocation.lng}&key=a7ac3cc8ba514f0287f82a6a306eabc8`);
      const data = await response.json();
      console.log(data)
      this.store.carDataLocation.city = data.results[0].components.province ?? ''
      this.store.carDataLocation.country = data.results[0].components.country ?? ''
      this.store.carDataLocation.fullAddress =  data.results[0].formatted ?? ''
      this.store.carDataLocation.lat = newLocation.lat ?? ''
      this.store.carDataLocation.lng = newLocation.lng ?? ''
      console.log(this.store.carDataLocation)
    },
    onChangeLocation(e){
      console.log(e.target)
      const newLocation = {
        lat:e.target._latlng.lat,
        lng:e.target._latlng.lng
      }
      this.getSelectedLocationInformations(newLocation)
    },
    async getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.currentLocation.lat = position.coords.latitude
            this.currentLocation.lng = position.coords.longitude
            this.latLng[0] = this.currentLocation.lat
            this.latLng[1] = this.currentLocation.lng
            console.log(this.latLng)
          },
          error => {
            console.log(error)
          }
        )
        if(this.currentLocation.lat && this.currentLocation.lng){
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${this.currentLocation.lat}+${this.currentLocation.lng}&key=a7ac3cc8ba514f0287f82a6a306eabc8`);
          const data = await response.json();
          console.log(data)
          this.currentLocation.city = data.results[0].components.province
          this.currentLocation.country = data.results[0].components.country
          this.currentLocation.fullAddress =  data.results[0].formatted
          console.log('currentLocation',this.currentLocation)
        }else{
          this.$q.notify({
            type:'negative',
            message:'Tekrar Deneyiniz !',
            timeout:700,
            position:'center'
          })
        }
      } else {
        console.log('Geolocation is not supported by this browser.')
      }
    },
  },
  created(){
  },
  mounted(){
  },
  watch:{

  }
}
</script>

<style>

</style>