import { CryptoAlgorithm } from './js/algorithm.js'

let cryptoAlgorithm = new CryptoAlgorithm();

//let runIntervalInMS = process.env.RUN_INTERVAL
let runIntervalInSeconds = process.env.RUN_INTERVAL_SECONDS
setTimeout(cryptoAlgorithm.runOnce, runIntervalInSeconds*1000);

//test commit Mircea