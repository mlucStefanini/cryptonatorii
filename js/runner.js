import { AlgGeorgelCelNorocos } from "./algorithms/georgelCelNorocos.js";
import { CryptoAlgorithm } from './algorithms/demo.js'
import { ApiCache } from "./cache.js";
import { RunContext } from "./utils.js";

export class PeriodicRunner {
    constructor(debug) {
        this.runIntervalInSeconds = process.env.RUN_INTERVAL_SECONDS;
        this.intervalCount = 1;
        this.debug = debug;
        this.api = new ApiCache(this.debug); 
        console.log(`Will run in debug mode? ${this.debug}`)
    }

    start() {
        setTimeout(this.runOnce.bind(this), 1000);
    }

    async runOnce() {
        var algorithmsToRun = [];
        var runContext = new RunContext(this.api, this.debug, this.intervalCount);
        try {
            if (process.env.ALG_GEORGEL_CEL_NOROCOS == "true")
                algorithmsToRun.push(new AlgGeorgelCelNorocos(runContext));
            if (process.env.ALG_DEMO == "true")
                algorithmsToRun.push(new CryptoAlgorithm(runContext));
            for (var i = 0; i < algorithmsToRun.length; i++) {
                await algorithmsToRun[i].runOnce();
            }
        } catch (ex) {
            console.error(`Error in iteration ${this.intervalCount}`, ex);
        }
        this.intervalCount++;
        setTimeout(this.runOnce.bind(this), this.runIntervalInSeconds * 1000);
    }
}