export class Candle {
    constructor(data) {
        this.openTime = new Date(data.openTime);
        this.closeTime = new Date(data.closeTime);
        this.open = data.open;
        this.close = data.close;
        this.high = data.high;
        this.low = data.low;

        this.candleValueAcceptedErrorPercentage = 20/100;
    }

    getBodyInterval = () => {
        if (this.isBullish()) {
            return [this.open, this.close];
        } else {
            return [this.close, this.open];
        }
    }

    getAcceptedErrorOnTheBodyInterval() {
        const openCloseInterval = this.getBodyInterval();
        return this.getAcceptedErrorOnTheInterval(openCloseInterval);
    }

    getAcceptedErrorOnTheInterval = (interval) => {
        return ((interval[1] - interval[0])) * this.candleValueAcceptedErrorPercentage;
    }

    getBodyHighMargin = () => {
        return this.isBullish() ? this.close : this.open;
    }

    getBodyLowMargin = () => {
        return this.isBullish() ? this.open : this.close;
    }

    getBodyMid = () => {
        return this.low + (this.getBodyHighMargin() - this.getBodyLowMargin())/2;
    }

    openCloseDifference = () => {
        let diff = 0;
        if (this.isBullish()) {
            diff = this.close - this.open;
        } else {
            diff = this.open - this.close;
        }

        return diff;
    }

    /* Distance between candle top margin and highest value */
    upperShadow = () => {
        const candleHighMargin = this.getBodyHighMargin();
        return this.high - candleHighMargin;
    }

    /* Distance between candle lower margin and lowest value */
    lowerShadow = () => {
        const candleLowerMargin = this.getBodyLowMargin();
        return candleLowerMargin - this.low;
    }

    isIncreasing = () => {
        return this.close > this.open;
    }

    /* Market is going up */
    isBullish = () => {
        return this.close > this.open;
    }

    /* Market is going down */
    isBearish = () => {
        return this.close < this.open;
    }

    isHammer = () => {
        return this.isBullish() && this.close === this.high;
    }

    isShootingStar = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        const interval = [this.low, this.low + acceptedError];
        return this.isBearish() && this.isIncludedInInterval(this.close, interval);
    }

    isBuyPressure = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        const interval = [this.high - acceptedError, this.high];
        return this.isBullish() && this.isIncludedInInterval(this.close, interval);
    }

    isSellPressure = () => {
        return this.isBearish() && this.close === this.low;
    }

    isIncludedInInterval(value, interval) {
        return interval[0] <= value && value <= interval[1];
    }

    isDoji = () => {
        const isDoji = false;
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        const openInverval = [this.open - acceptedError, this.open + acceptedError];
        const closeInterval = [this.close - acceptedError, this.close + acceptedError];
        
        if (this.isIncludedInInterval(this.open, closeInterval) && this.isIncludedInInterval(this.close, openInverval)) {
            isDoji = true;
        }

        return isDoji;
    }

    /*This pattern resembles a gravestone, hence the name. It is formed when the open and the close occur at the low of the period.
    Bearish selling pressure. Seller had the last call.
    If spotted at top of uptrend it can be a sign of trend switch */
    isGravestoneDoji = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        
        return this.isDoji() && this.lowerShadow() >= 0 && this.lowerShadow() <= this.low + acceptedError;
    }

    /*This pattern is formed when the opening and the closing prices of a security are at the high of the period. It includes a long lower shadow and signals a reversal of an uptrend. 
    Important if located at bottom of downtrend then potential upside move*/
    isDragonflyDoji = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();

        return this.isDoji() && this.upperShadow() >= 0 && this.upperShadow() >= this.high - acceptedError;
    }

    /* Can be a sign of a lot of emotion on the market, if there is a big value of trades also */
    isLongCandle = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        const highMargin = this.getBodyHighMargin();
        const lowMargin = this.getBodyLowMargin();
        const upperInterval = [this.high - acceptedError, this.high];
        const lowerInterval = [this.low, this.low + acceptedError];

        return this.isIncludedInInterval(highMargin, upperInterval) && this.isIncludedInInterval(lowMargin, lowerInterval);
    }

    /* Sign of significant volatility in the frame, buyers sent the market up; sellers sent it down. But in the end, neither had the upper hand
    The colour of the stick doesn't matter – all you need to look for is the long wick and shorter body.
    A spinning top is often a sign that an existing trend is showing signs of petering out. In a long downtrend, for instance, sellers might have near-total control of a market.
    In a spinning top, that control has weakened significantly.*/
    isSpinningTop = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        const spinningTopMargin = acceptedError * 2;
        const bodyMid = this.getBodyMid();
        const testInterval = [bodyMid - spinningTopMargin, bodyMid + spinningTopMargin];

        return (this.isIncludedInInterval(this.high, testInterval) && this.isIncludedInInterval(this.low, testInterval)) && this.shadowsAreAlmostEqual();
    }

    shadowsAreAlmostEqual = () => {
        const acceptedError = this.getAcceptedErrorOnTheBodyInterval();
        let diff = 0;
        
        if (this.upperShadow() > this.lowerShadow()) {
            diff = this.upperShadow() - this.lowerShadow();
        } else {
            diff = this.lowerShadow() - this.upperShadow();
        }

        return diff < acceptedError;
    }
}