import Vue from 'vue'
import World from './components/World'

Vue.config.productionTip = false

new Vue({
  render: h => h(World),
}).$mount('#app')
