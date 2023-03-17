import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './assets/tailwind.css'

const app = createApp(App)

app.mount('#app')
