<template>
  <q-btn icon="attach_file" color="grey-8" size="sm" v-on:click="openFile" round></q-btn>
  <q-file ref="fileInput" v-model="this.image" style="display: none" @update:model-value="selectNewFile"/>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {useCounterStore} from '../stores/store'
export default {
  components:{
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      imageForBack:'',
      image:null,
      randomId:null,
      currentImageData:{},
      imageList:[],
      index:0
    }
  },
  methods:{
    openFile(){
      this.$refs.fileInput.$el.click()
    },
    async selectNewFile(){
      this.index = this.index + 1
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.imageForBack = reader.result;
        this.currentImageData = {
          id: uuidv4(),
          image: this.imageForBack,
          userId:this.store.userDetail._id,
          imageId:uuidv4(),
          fileType: this.image.type === 'image/png' ? 'png' : 'other', 
          fileName: `photo_${this.index}`,
        };
        console.log(this.currentImageData)
      });
      if (this.image) {
        reader.readAsDataURL(this.image);
      }
    }
  },
  watch:{
    currentImageData:{
      handler(newValue,oldValue){
        if(newValue.image){
          //this.$emit('imageList',this.imageList)
          this.$emit('currentImageData',this.currentImageData)
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>
