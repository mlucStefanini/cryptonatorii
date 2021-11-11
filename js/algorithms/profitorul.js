export class Profitorul {
    constructor(runContext) {
        this.api = runContext.api;
    }

    async runOnce() {
        let symbols = ['BTC', 'ETH', 'DOGE', 'ADA', 'LTC', 'MATIC', 'BNB', 'EGLD', 'NEO', 'SOL', 'XRP'];
        let result = [];

        for (let i = 0; i < symbols.length; i++) {
            let symbol = symbols[i];

            var history = await this.api.symbolHistory({
                symbol: symbol,
                interval: '1m'
            });
            console.log("[Profitorul] got history info");   
            
            const historicalData = history;

            let openedPosition = null;
            let profit = 0.0;
            let tradesCount = 0;

            let previousOpeningPrice = historicalData[0][2];
            let previousClosingPrice = historicalData[0][4];

            for (let j = 0; j < historicalData.length; j++){
                let data = historicalData[j];    
           
                let currentOpeningPrice = data[2];
                let currentClosingPrice = data[4];
                
                if (currentOpeningPrice > previousOpeningPrice) {
                    if (openedPosition == null) {
                        openedPosition = { openingPrice: currentOpeningPrice };
                        previousOpeningPrice = currentOpeningPrice;
                        previousClosingPrice = currentClosingPrice;
                        continue;
                    }
                }

                if (openedPosition != null) {
                    if (currentClosingPrice < currentOpeningPrice) {
                        let diff = currentClosingPrice - openedPosition.openingPrice;
                        profit += diff / openedPosition.openingPrice * 100;
                        openedPosition = null;
                        tradesCount++;
                        continue;
                    }
                }
            }

            result.push({
                symbol: symbol,
                profit: profit,
                tradesCount: tradesCount
            });
        }
    }
}