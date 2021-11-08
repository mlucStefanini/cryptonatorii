import { Api } from "./api.js";

export class CryptoAlgorithm {
    constructor() {
        var apiKey = process.env.API_KEY;
        this.api = new Api(apiKey); 
    }

    async runOnce() {
        var account = await this.api.account();
        console.log(account);

        var history = await this.api.symbolHistory({
            symbol: 'BTC',
            interval: '1h'
        });
        console.log(history);

        // Find a coin which is not USD
        var nonUSDTCoinToSell = account.symbols.find(p => p.quantity > 0 && p.name != "USDT");
        // If we find one we sell it
        if (nonUSDTCoinToSell !== undefined) {        
            await this.api.order({ symbol: nonUSDTCoinToSell.name, side: 'SELL', quantity: nonUSDTCoinToSell.quantity });
        }
        // If we don't we buy one
        else {
            var prices = await this.api.prices();
            prices = prices.filter(p => p.name !== "USDT");
            var rand = Math.floor(Math.random() * prices.length);
            var coinToBuy = prices[rand];
            var amountToBuy = account.symbols.find(s => s.name === "USDT").quantity / coinToBuy.value;
            await this.api.order({ symbol: coinToBuy.name, side: 'BUY', quantity: amountToBuy * 0.01 });
        }

        const orderHistory = await this.api.orderHistory();
        console.log(`Order History: ${JSON.stringify(orderHistory)}`);
    }
}