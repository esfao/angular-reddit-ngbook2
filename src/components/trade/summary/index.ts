
import Stream from "xstream";
import {OrderHistory} from "../../../models/orderHistory";
import {Position} from "../../../models/position";
import {Sinks} from "../../index";
import {Sources} from "../index";
import "./index.styl";
import {intent} from "./intent";
import {model} from "./model";
import {request} from "./request";
import {view} from "./view";

export interface State {
    collateral: number;
    currentPrice: number;
    histories: OrderHistory[];
    marketState: any;
    position: Position;
}

export const SummaryComponent = (sources: Sources): Sinks => {
    const actions = intent(sources);
    const reducer$ = model(actions);
    const view$ = view(sources.state.stream as any);
    const request$ = request();

    return {
        DOM: view$,
        HTTP: request$,
        router: Stream.never(),
        state: reducer$,
        storage: Stream.never(),
    };
};