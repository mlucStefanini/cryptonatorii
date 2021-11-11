import { Candle } from './candle.js';

export class SymbolHistoryFrame {
    constructor(data) {
        this.volume = data[5];
        this.numberOfTrades = data[7];
        this.takerBuyBaseAssetVolume = data[8];
        this.takerBuyQuoteAssetVolume = data[9];

        this.candle = new Candle({
            openTime: data[0],
            open: data[1],
            closeTime: data[6],
            close: data[4],
            high: data[2],
            low: data[3]
        })
    }
}