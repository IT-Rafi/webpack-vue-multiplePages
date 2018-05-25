import Vue from 'Vue'
import personalRecord from './personalRecord.vue'
import utils from '../../common/js/utils.js'
Vue.use(utils)
new Vue({
    el: '#app',
    render: h => h(personalRecord)
})