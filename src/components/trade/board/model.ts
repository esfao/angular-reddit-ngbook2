import {Reducer} from "@cycle/state";
import Stream from "xstream";
import {Board} from "../../../models/board";
import {Position} from "../../../models/position";
import {ceilBy, floorBy} from "../../../util";
import {State} from "./";
import {Actions} from "./intent";

const defaultState: State = {
    board: new Board({ bids: [], asks: [] }),
    currentPrice: 0,
    groupedSize: 1,
    orders: [],
    position: new Position([]),
    price: 0,
    stopOrders: [],
};

export const model = (actions: Actions): Stream<Reducer<State>> => {
    const defaultReducer$ = Stream.of((state: State) => state || defaultState);

    const askPriceReducer$ = actions.onClickAsk$
        .map((price) => (state: State) => ({ ...state, price: floorBy(price - 1, state.groupedSize) }));

    const bidPriceReducer$ = actions.onClickBid$
        .map((price) => (state: State) => ({ ...state, price: ceilBy(price + 1, state.groupedSize) }));

    const boardReducer$ = actions.onBoardLoaded$
        .map((board) => (state: State) => ({ ...state, board: state.board.merge(board.asks, board.b