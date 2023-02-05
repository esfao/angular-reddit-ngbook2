import {ceilBy, floorBy} from "../util";
import {BoardOrder} from "./boardOrder";

export class Board {
    public asks: BoardOrder[];
    public bids: BoardOrder[];

    constructor(json: any) {
        this.asks = json.asks.map((ask: object) => new BoardOrder(ask));
        this.bids = json.bids.map((bid: object) => new BoardOrder(bid));
    }

    public spread(): number {
        const upper = (this.asks[0] || { price: 0 }).price;
        const lower = (this.bids[0] || { price: 0 }).price;
        return upper - lower;
    }

    public remove(side: string, price: number) {
        if (side === "BUY") {
            this.asks = this.asks.filter((ask) => ask.price >= price);
        } else {
            this.bids = this.bids.filter((bid) => bid.price <= price);
        }
    }

    public merge(asks: BoardOrder[], bids: BoardOrder[]): Board {
        const asksToRemove = asks.map((ask) => ask.price);
        const asksToAppend = asks.filter((ask) => ask.size !== 0.0).map((ask) => new BoardOrder(ask));
        const bidsToRemove = bids.map((bid) => bid.price);
        const bidsToAppend = bids.filter((bid) => bid.size !== 0.0).map((bid) => new BoardOrder(bid));

        this.asks = this.asks
            .filter((ask) => !asksToRemove.reduce((previous, price) =