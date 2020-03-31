import Axios from 'axios';

Axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';  // application/x-www-form-urlencoded; charset=UTF-8
    config.headers['token'] = $.cookie('token') || 'dev';
    if (config.method == 'get') {
        if (!config.params) config.params = {};
        config.params['_r'] = Math.random()
        // if (localStorage.token) config.params['accessToken'] = localStorage.token || '';
    }
    // if(config.method == 'post'){
    //     if (!config.data) config.data = '';
    //     config.data += '&accessToken=' + localStorage.token || '';
    // }
    return config;
}, error => {
    return Promise.reject(error);
})
Axios.interceptors.response.use(response => {
    // if (response.data.code !== 200) {
    //     return Promise.reject(response.data.message);
    // }
    return response.data.data;
}, error => {
    return Promise.reject(error);
})

export default Axios;