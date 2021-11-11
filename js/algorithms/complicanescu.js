export class Complicanescu {
    constructor(runContext) {
        this.api = runContext.api;
    }

    runOnce() {
        let symbols = ['BTC', 'ETH', 'DOGE', 'ADA', 'LTC', 'MATIC', 'BNB', 'EGLD', 'NEO', 'SOL', 'XRP'];
        let result = [];

        symbols.forEach((symbol) => {
            let json = readFileSync(`./historicalData/${symbol}-1h.txt`, 'utf-8');
            const historicalData = JSON.parse(json);

            for (let i = 15; i < historicalData.length; i++) {
                console.log(this.calculateRsi(historicalData.slice(i - 15, 15)));
            }
        });
    }

    calculateRsi(closingPrices) {
        let sumGain = 0;
        let sumLoss = 0;

        for (let i = 0; i < closingPrices.length; i++) {
            let diff = closingPrices[i] - closingPrices[i-1];
            if (diff >= 0) {
                sumGain += diff;
            } else {
                sumLoss -= diff;
            }
        }

        if (sumGain == 0) return 0;

        var rsi = sumGain / sumLoss;

        return 100.0 - (100.0 / (1 + rsi));
    }
}