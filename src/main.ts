import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRepeat, faArrowRotateRight, faShuffle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'uno.css'
import './router/guard'

// 添加图标到库
library.add(faRepeat, faArrowRotateRight, faShuffle)

const app = createApp(App)
const pinia = createPinia()

// 注册插件
app.use(pinia)
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)


app.mount('#app')