import { SymbolHistory } from '../../js/symbolHistory/symbolHistory.js';
import { SymbolHistoryFrame } from '../../js/symbolHistory/symbolHistoryFrame.js';
import { Candle } from '../../js/symbolHistory/candle.js';



export class SymbolHistoryBuilder {
    build = (symbol, type, timeFrame) => {
        switch(type) {
            case 'doji':
                return new SymbolHistory(symbol, this.getDojiCandlesData(), timeFrame);
        }

        throw 'Type not identified';
    }

    getDojiCandlesData = () => {
        return [
            [1636628400000,"2.12400000","2.13000000","2.11300000","2.12600000","4416494.30000000",1636631999999,"9372241.20940000",13526,"2066696.60000000","4385523.32820000","0"],
            [1636621200000,"2.13800000","2.15300000","2.12400000","2.14000000","10155517.80000000",1636624799999,"21718190.95590000",22915,"5485607.10000000","11730286.68980000","0"],
            [1636617600000,"2.14100000","2.14600000","2.10600000","2.13800000","8163776.80000000",1636621199999,"17341906.93540000",25206,"4211783.10000000","8949632.95830000","0"],
            [1636610400000,"2.11800000","2.12200000","2.09600000","2.12000000","6141588.40000000",1636613999999,"12949038.93870000",17546,"3009928.30000000","6346424.81620000","0"],
        ]
    }
}