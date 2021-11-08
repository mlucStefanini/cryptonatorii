import { CryptoAlgorithm } from './js/algorithm.js'
import dotenv from 'dotenv';
dotenv.config();
let cryptoAlgorithm = new CryptoAlgorithm();

//let runIntervalInMS = process.env.RUN_INTERVAL
let runIntervalInSeconds = process.env.RUN_INTERVAL_SECONDS

setTimeout(cryptoAlgorithm.runOnce.bind(cryptoAlgorithm), runIntervalInSeconds*1000);