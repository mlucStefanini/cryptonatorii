import axios from "axios";
var API_URL = 'https://crypto-bot-stefanini.herokuapp.com/api';

export class Api {   
    constructor(key) {
        axios.defaults.headers.common['key'] = key;
    }

    async symbolHistory(params) {
        return this.get('/trading/symbolHistory', {params})
            .then((response) => response.data);
    }

    async price(params) {
        return this.get('/trading/price', {params})
            .then((response) => response.data);
    }

    async prices() {
        return this.get('/trading/prices')
            .then((response) => response.data);
    }

    async accountHistory() {
        return this.get('/trading/accountHistory')
            .then((response) => response.data);
    }

    async account() {
        return this.get('/trading/account')
            .then((response) => response.data);
    }

    async orderHistory() {
        return this.get('/trading/orderHistory')
            .then((response) => response.data);
    }

    async reset(params) {
        return this.post('/trading/reset', params)
            .then((response) => response.data);
    }

    async order(params) {
        return this.post('/trading/order', params)
            .then((response) => response.data);
    }

    async get(path, data) {
        return axios
          .get(`${API_URL}${path}`, data)
          .then((response) => response)
          .catch((error) => {
                console.log(error.response);
                return Promise.resolve({data: "Error! Check the browser's console!"});
            });
    }

    async post(path, data) {
        return axios
          .post(`${API_URL}${path}`, data)
          .then((response) => response)
          .catch((error) => {
                console.log(error.response);
                return Promise.resolve({data: "Error! Check the browser's console!"});
            });
    }
}
