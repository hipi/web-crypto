import Vue from "vue";
import App from "./App.vue";

// element-ui
import "element-ui/lib/theme-chalk/index.css";
import {
  Button,
  Input,
  Tooltip,
  Progress,
  MessageBox,
  Message,
  Loading
} from "element-ui";
Vue.use(Button);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Progress);
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
