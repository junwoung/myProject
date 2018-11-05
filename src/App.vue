<template>
  <div>
  	<my-dialog ref="Layer"></my-dialog>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import '@/frame/common/common.css'
import router from './router/index.js';
export default {
  name: 'App',
  router
}
</script>
