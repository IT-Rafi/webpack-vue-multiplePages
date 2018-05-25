import Vue from 'Vue'
import rankingList from './rankingList.vue'
import utils from '../../common/js/utils.js'
Vue.use(utils)
new Vue({
    el: '#app',
    render: h => h(rankingList)
})