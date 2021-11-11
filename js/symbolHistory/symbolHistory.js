import { SymbolHistoryFrame } from './symbolHistoryFrame.js';

export class SymbolHistory {
    constructor(symbol, symbolHistoryFrames, timeFrame) {
        this.symbol = symbol;
        this.timeFrame = timeFrame;
        this.historyFrames = [];

        if (Array.isArray(symbolHistoryFrames) && symbolHistoryFrames.length > 0) {
            symbolHistoryFrames.forEach((frame) => {
                const symbolFrame = new SymbolHistoryFrame(frame);
                this.historyFrames.push(symbolFrame);
            });

            this.historyFrames = this.historyFrames.reverse();
        }
    }
}