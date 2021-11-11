export class AlgGeorgelCelNorocos {
    constructor(runContext) {
        this.debug = runContext.debug;
        this.api = runContext.api;
    }

    async runOnce() {
        var account = await this.api.account();
        console.log("[georgel] got account info");

        var history = await this.api.symbolHistory({
            symbol: 'BTC',
            interval: '1h'
        });
        console.log("[georgel] got history info");        
    }
}
