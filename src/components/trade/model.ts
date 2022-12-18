import {Reducer} from "@cycle/state";
import Stream from "xstream";
import {IFDOCOrder} from "../../models/ifdocoOrder";
import {Order} from "../../models/order";
import {Position} from "../../models/position";
import {StopOrder} from "../../models/stopOrder";
import {State} from "./index";
import {Actions} from "./intent";

const defaultState: State = {
    currentPrice: 0,
    histories: [],
    ifdocoOrder: new IFDOCOrder(10000, 50),
    isOrdering: false,
    orders: [],
    position: new Position([]),
    price: 0,
    size: 0,
    stopOrders: [],
};

export const model = (actions: Actions): Stream<Reducer<State>> => {
    const defaultReducer$ = Stream.of((state: State) => state || defaultState);

    const cancelOrdersReducer$ = actions.onCancelOrders$
        .map((_) => (state: State) => ({ ...state, orders: [] as Order[], stopOrders: [] as StopOrder[] }));

    const currentPriceReducer$ = actions.onExecutionCreated$
        .map((execution: any) => (state: State) => {
            if (state.boardComponentState) { state.boardComponentState.board.remove(execution.side, execution.price); }
            return { ...state, currentPrice: execution.price };
        });

    const historyReducer$ = actions.onHistoryCreated$
        .map((history) => (state: State) => ({ ...state, histories: [history].concat(state.histories)}));

    const isOrderingReducer$ = Stream.merge(
        actions.onClickMarketBuyButton$.mapTo(true),
        actions.onClickMarketSellButton$.mapTo(true),
        actions.onClickLimitBuyButton$.mapTo(true),
        actions.onClickLimitSellButton$.mapTo(true),
        actions.onClickClearButton$.mapTo(true),
        actions.onHistoryCreated$.mapTo(false),
    ).map((isOrdering) => (state: State) => ({ ...state, isOrdering }));

    const ordersRed