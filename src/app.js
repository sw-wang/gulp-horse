import '@babel/polyfill'
import api from "./config/api"
import axios from "./config/axios"
window['$api'] = api
window['$http'] = axios
