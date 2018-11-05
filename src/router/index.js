/** 引入基础npm包 **/
import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import echarts from 'echarts'

/** 页面骨架相关 **/
import frame from '../frame/frame.vue'

/** 引入封装的常用方法 **/
import commonjs from '../frame/common/common.js'

/** 引入插件和指令 **/
import vPage from '../components/vPagination/pagination.js'
import vDialog from '../components/VDialog/dialog.js'
import vSelect from '../components/vSelect/select.js'
import vCarousel from '../components/vCarousel/carousel.js'
import vScore from '../components//vScore/score.js'
import vTime from '../components/vTime/time.js'
import vUpload from '../components/vUpload/upload.js'
import lazyLoad from '../directive/lazyLoad.js'

/** 具体业务路由 **/
import businessRoute from '../business/router.js'

import login from '../business/login/login.vue'

/** 将具体方法挂载到vue原型 **/
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$utils = commonjs;
Vue.prototype.$api = api;

/** 引入具体接口api信息 **/
import api from '../api/index.js'

/** 引用具体插件、指令 **/
Vue.use(frame);
Vue.use(Router);
Vue.use(vPage);
Vue.use(vDialog);
Vue.use(vSelect);
Vue.use(vCarousel);
Vue.use(vScore);
Vue.use(vTime);
Vue.use(vUpload);
Vue.use(lazyLoad);



export default new Router({
  routes: [
    {
      path: '/',
      component: frame,
      children: businessRoute
    },
    {
      path: '/login',
      component: login
    },
    {
    	path: '*',
    	redirect: '/'
    }
  ]
})
