import { readFileSync } from 'fs';

export class CandleBurner {
    constructor(runContext) {
        this.api = runContext.api;
    }

    //works best for: MATIC +26%, BNB +25%
    //works good for DOGE +15%
    //works ok for ETH +10%, NEO +8%, SOL +9%, XRP +6%
    //doesn't work at all for BTC -11%, ADA -18%
    //irrelevant for LTC, EGLD
    async runOnce() { 
        let symbols = ['BTC', 'ETH', 'DOGE', 'ADA', 'LTC', 'MATIC', 'BNB', 'EGLD', 'NEO', 'SOL', 'XRP'];
        let result = [];

        symbols.forEach((symbol) => {
            let json = readFileSync(`./historicalData/${symbol}-1h.txt`, 'utf-8');
            const historicalData = JSON.parse(json);

            let openedPosition = null;
            let profit = 0.0;
            let tradesCount = 0;

            let previousClosingPrice = historicalData[0][4];
            historicalData.forEach((data, index) => {
                let currentClosingPrice = data[4];

                //open positions
                if (currentClosingPrice > previousClosingPrice * 1.001) {
                    if (openedPosition == null) {
                        openedPosition = { openingPrice: currentClosingPrice };
                        previousClosingPrice = currentClosingPrice;
                        return;
                    }
                }

                //close positions
                if (openedPosition != null) {
                    if (currentClosingPrice < previousClosingPrice && currentClosingPrice < historicalData[index - 2][4]) {
                        let diff = currentClosingPrice - openedPosition.openingPrice;
                        profit += diff / openedPosition.openingPrice * 100;
                        openedPosition = null;
                        tradesCount++;
                    }
                }

                //stop loss
                if (openedPosition != null) {
                    if (currentClosingPrice < previousClosingPrice * 0.99) {
                        let diff = currentClosingPrice - openedPosition.openingPrice;
                        profit += diff / openedPosition.openingPrice * 100;
                        openedPosition = null;
                        tradesCount++;
                    }
                }

                previousClosingPrice = currentClosingPrice;
            })
            result.push({
                symbol: symbol,
                profit: profit,
                tradesCount: tradesCount
            });
        });
    }
}