import fs from 'fs';
import { SymbolHistory } from '../symbolHistory/symbolHistory.js';
// sleep time expects milliseconds
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
export class Accumulator {
    
    constructor(runContext) {
        this.debug = runContext.debug;
        this.api = runContext.api;
    }
    
    runOnce = async () => {
        try {
            let symbols = ['BTC', 'ETH', 'DOGE', 'ADA', 'LTC', 'MATIC', 'BNB', 'EGLD', 'NEO', 'SOL', 'XRP'];
            const timeFrame = '1h';
            let arrayOfSymbolHistories = [];
            let symbolPromises = [];

            symbols.forEach((symbol) => {
                let symbolPromise = new Promise(async (resolve, reject) => {
                    try {
                        const randomTimeWait = Math.random() * 10000 + 2000;
                        await sleep(randomTimeWait);

                        const symbolHistory = await this.getSymbolHistory(symbol, timeFrame);
                        arrayOfSymbolHistories.push(symbolHistory);

                        resolve(symbolHistory);
                    } catch(exc) {
                        console.log(exc);
                        reject(exc);
                    }
                });
    
                symbolPromises.push(symbolPromise);
            });
    
            const result = await Promise.all(symbolPromises);
    
            return arrayOfSymbolHistories;
        } catch(exc) {
            console.log(exc);
        }
    }



    getSymbolHistory = async (symbol, timeFrame) => {
        try {
            const historyData = await this.api.symbolHistory({
                symbol: symbol,
                interval: timeFrame
            });

            const symbolHistory = new SymbolHistory(symbol, historyData, timeFrame);
            //await fs.writeFileSync(`./js/accumulator/testdata/${symbol}.json`, JSON.stringify(historyData.reverse()));
            return symbolHistory;
        } catch(exc) {
            console.log(exc);
        }
    }
}