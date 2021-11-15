export class Complicanescu {
    constructor(runContext) {
        this.api = runContext.api;
    }

    async runOnce() {
        let tradingRules = [
            { symbol: "BTC", smallRsi: 45, highRsi: 60 },
            { symbol: "ETH", smallRsi: 50, highRsi: 60 },
            { symbol: "DOGE", smallRsi: 20, highRsi: 75 },
            { symbol: "ADA", smallRsi: 25, highRsi: 85 },
            { symbol: "LTC", smallRsi: 40, highRsi: 85 },
            { symbol: "MATIC", smallRsi: 50, highRsi: 75 },
            { symbol: "BNB", smallRsi: 25, highRsi: 90 },
            { symbol: "EGLD", smallRsi: 50, highRsi: 80 },
            { symbol: "NEO", smallRsi: 50, highRsi: 60 },
            { symbol: "SOL", smallRsi: 45, highRsi: 80 },
            { symbol: "XRP", smallRsi: 40, highRsi: 60 },
        ]

        var account = await this.api.account();
        console.log(`[Complicanescu] account status: ${JSON.stringify(account)}`);

        for (let i = 0; i < tradingRules.length; i++) {
            let tradingRule = tradingRules[i];

            var history = await this.api.symbolHistory({
                symbol: tradingRule.symbol,
                interval: '1h'
            });
            console.log(`[Complicanescu] got history info for ${tradingRule.symbol}`);

            const closingPrices = history.map(x => parseFloat(x[4]));

            let rsi = this.calculateRsi(closingPrices.slice(closingPrices.length - 15, closingPrices.length))

            let openedPosition = account.symbols.find(x => x.name == tradingRule.symbol && x.quantity > 0);
            if (openedPosition) {
                if (rsi > tradingRule.highRsi) {
                    let order = {
                        symbol: tradingRule.symbol,
                        side: 'SELL',
                        quantity: openedPosition.quantity
                    };
                    console.log(`[Complicanescu] placing closing order: ${JSON.stringify(order)}`);
                    let orderResponse = await this.api.order(order);
                    console.log(`[Complicanescu] orderResponse: ${JSON.stringify(orderResponse)}`);
                }
            } else {
                if (rsi < tradingRule.smallRsi) {
                    let order = {
                        symbol: tradingRule.symbol,
                        side: 'BUY',
                        quantity: account.estimatedValue / 3 / 11
                    };
                    console.log(`[Complicanescu] placing opening order: ${JSON.stringify(order)}`);
                    let orderResponse = await this.api.order(order);
                    console.log(`[Complicanescu] orderResponse: ${JSON.stringify(orderResponse)}`);
                }
            }

            console.log(`[Complicanescu] done for ${tradingRule.symbol}`);
        }
    }

    calculateRsi(closingPrices) {
        let sumGain = 0;
        let sumLoss = 0;

        for (let i = 1; i < closingPrices.length; i++) {
            let diff = closingPrices[i] - closingPrices[i - 1];
            if (diff >= 0) {
                sumGain += diff;
            } else {
                sumLoss -= diff;
            }
        }

        if (sumGain == 0) return 0;

        let rsi = sumGain / sumLoss;

        return 100.0 - (100.0 / (1 + rsi));
    }
}