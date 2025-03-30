import { createApp } from 'vue';
import monitor from '../../dist/monitor.esm.js';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(monitor, {
    url: 'http://localhost:9800/reportData',
});
app.mount('#app');
