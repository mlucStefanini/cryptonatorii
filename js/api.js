import axios from "axios";
var API_URL = 'https://crypto-bot-stefanini.herokuapp.com/api';

export class Api {   
    constructor(key, debug) {
        axios.defaults.headers.common['key'] = key;
        this.debug = debug;
    }

    async symbolHistory(params) {
        this.debug && console.log("[api] get /trading/symbolHistory");
        return this.get('/trading/symbolHistory', {params})
            .then((response) => response.data);
    }

    async price(params) {
        this.debug && console.log("[api] get /trading/price");
        return this.get('/trading/price', {params})
            .then((response) => response.data);
    }

    async prices() {
        this.debug && console.log("[api] get /trading/prices");
        return this.get('/trading/prices')
            .then((response) => response.data);
    }

    async accountHistory() {
        this.debug && console.log("[api] get /trading/accountHistory");
        return this.get('/trading/accountHistory')
            .then((response) => response.data);
    }

    async account() {
        this.debug && console.log("[api] get /trading/account");
        return this.get('/trading/account')
            .then((response) => response.data);
    }

    async orderHistory() {
        this.debug && console.log("[api] get /trading/orderHistory");
        return this.get('/trading/orderHistory')
            .then((response) => response.data);
    }

    async reset(params) {
        this.debug && console.log("[api] post /trading/reset");
        return this.post('/trading/reset', params)
            .then((response) => response.data);
    }

    async order(params) {
        this.debug && console.log("[api] post /trading/order");
        return this.post('/trading/order', params)
            .then((response) => response.data);
    }

    async get(path, data) {
        return axios
          .get(`${this.getApiUrl()}${path}`, data)
          .then((response) => response)
          .catch((error) => {
                console.warn(error.message);
                return Promise.resolve({data: `Error! GET ${path}`});
            });
    }

    async post(path, data) {
        return axios
          .post(`${this.getApiUrl()}${path}`, data)
          .then((response) => response)
          .catch((error) => {
                console.warn(error.message);
                return Promise.resolve({data: `Error! POST ${path}`});
            });
    }

    getApiUrl() {
        return API_URL;
    }
}
