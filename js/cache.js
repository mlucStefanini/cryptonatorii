import { Api } from "./api.js";
import { equalObj } from "./utils.js";

export class ApiCache {
    constructor(debug) {
        var apiKey = process.env.API_KEY;
        this.api = new Api(apiKey, true);
        this.timeout = process.env.CACHE_TIMEOUT_SECONDS * 1000;
        /**
         * a key/value dictionary-like structure (list actually) with a timestamp
         * structure is:
         * key: { 
         *  request: symbolHistory|price|prices|accountHistory|account|orderHistory|reset,
         *  params: params
         * },
         * value: promise(data),
         * timestamp,
         */
        this.cache = [];
        this.debug = debug;
    }

    findEntry(request, params) {
        this.debug && console.log(`checking cache for request ${request}`);
        for (var i = 0; i < this.cache.length; i++) {
            var key = this.cache[i].key;
            this.debug && console.log(`comparing with entry ${i}.request=${key.request}`);
            if (key.request !== request) continue;
            if (!equalObj(params, key.params, this.debug)) continue;
            return this.cache[i];
        }
    }

    async getEntry(request, params) {
        var now = Date.now();
        var oldestTimestamp = now - this.timeout;
        var cachedEntry = this.findEntry(request, params);
        if (cachedEntry) {
            if (cachedEntry.timestamp < oldestTimestamp) {
                this.debug && console.log(`cached value expired for request ${request}, get new value`);
                cachedEntry.timestamp = now;
                cachedEntry.value = this.api[request](params);
            }
        } else {
            this.debug && console.log(`no cached value found for request ${request}, get new value`);
            cachedEntry = {
                key: {
                    "request": request,
                    "params": params
                },
                timestamp: now,
                value: this.api[request](params)
            }
            this.cache.push(cachedEntry);
            this.debug && console.log(`cache size is ${this.cache.length}`);
        }
        return cachedEntry.value;
    }

    removeEntry(request) {
        this.cache = this.cache.filter(entry => entry.key.request != request);
    }

    async symbolHistory(params) {
        return this.getEntry("symbolHistory", params);
    }

    async price(params) {
        return this.getEntry("price", params);
    }

    async prices() {
        return this.getEntry("prices");
    }

    async accountHistory() {
        return this.getEntry("accountHistory");
    }

    async account() {
        return this.getEntry("account");
    }

    async orderHistory() {
        return this.getEntry("orderHistory");
    }

    async reset(params) {
        return this.getEntry("reset", params);
    }

    async order(params) {
        // should reset order history?
        return this.api.order(params);
    }
}