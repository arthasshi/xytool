import Vue from 'vue'
import App from './App.vue'
import router from './router'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './registerServiceWorker'
import tween from "./pligins/tween";
import VueClipboard from 'vue-clipboard2'
import Toast from 'muse-ui-toast';
import Loading from 'muse-ui-loading';
Vue.use(Loading);


Vue.use(Toast);

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(tween);

Vue.use(MuseUI);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
