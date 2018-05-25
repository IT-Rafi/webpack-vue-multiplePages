import Vue from 'Vue'
import personalCenter from './personalCenter.vue'
import utils from '../../common/js/utils.js'
Vue.use(utils)
new Vue({
    el: '#app',
    render: h => h(personalCenter)
})