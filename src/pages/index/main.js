import Vue from 'Vue'
import App from './App.vue'
import utils from '../../common/js/utils.js'
Vue.use(utils)
new Vue({
    el: '#app',
    render: h => h(App)
})