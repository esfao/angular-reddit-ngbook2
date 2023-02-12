export class IFDOCOrder {
    public width: number;
    public ratio: number;

    constructor(width: number, ratio: number) {
        this.width = width;
        if (ratio > 100) {
            this.ratio = 100;
        } else if (ratio < 0) {
            this.ratio = 0;
        } else {
            this.ratio = ratio;
        }
    }

    public buyProfitLine(currentP