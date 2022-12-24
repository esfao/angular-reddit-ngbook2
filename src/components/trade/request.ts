import {RequestInput} from "@cycle/http";
import Stream from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import {
    cancelOrders,
    getOrders,
    getParentOrder,
    getParentOrders,
    getPositions,
    ifdocoOrder,
    limitOrder,
    marketOrder,
} from "../../http";
import {State} from "./index";
import {Actions} from "./intent";

export const request = (actions: Actions, state$: Stream<State>): Stream<string | RequestInput | null> => {
    const orders = Stream.periodic(10000).mapTo(getOrders()).startWith(getOrders());
    const parentOrders = Stream.periodic(10000).mapTo(getParentOrders()).startWith(getParentOrders());
    const positions = Stream.periodic(10000).mapTo(getPositions()).startWith(getPositions());

    const ifdocoOrders = actions.onIFDOCOOrdersLoaded$
        .map((os) => Stream.fromArray(os.map((order: any) => getParentOrder(order.parent_order_id))))
        .flatten();

    const marketBuy = actions.onClickMarketBuyButton$
        .compose(sampleCombine(state$))
        .map(([_, state]) => marketOrder(state.size, "BUY"));

    const market