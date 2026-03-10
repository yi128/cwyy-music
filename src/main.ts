import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRepeat, faArrowRotateRight, faShuffle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'uno.css'

const app = createApp(App)
const pinia = createPinia()

library.add(faRepeat, faArrowRotateRight, faShuffle)
app.use(pinia)
app.use(router)
app.mount('#app')
app.component('font-awesome-icon', FontAwesomeIcon)