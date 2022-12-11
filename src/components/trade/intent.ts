import {Response, ResponseStream} from "@cycle/http";
import {MemoryStream, Stream} from "xstream";
import {createOrderHistory, OrderHistory} from "../../models/orderHistory";
import {Position} from "../../models/position";
import {StopOrder} from "../../models/stopOrder";
import {Sources} from "./index";

export interface Actions {
    onApiKeyLoaded$: Stream<string>;
    onApiSecretLoaded$: Stream<string>;
    onCancelOrders$: Stream<null>;
    onClickClearButton$: Stream<null>;
    onClickClearOrderButton$: Stream<null>;
    onClickGroupSizePlusButton$: Stream<null>;
    onClickGroupSizeMinusButton$: Stream<null>;
    onClickLimitBuyButton$: Stream<null>;
    onClickLimitSellButton$: Stream<null>;
    onClickMarketBuyButton$: Stream<null>;
    onClickMarketSellButton$: Stream<null>;
    onClickIFDOCOBuyButton$: Stream<null>;
    onClickIFDOCOSellButton$: Stream<null>;
    onExecutionCreated$: Stream<object>;
    onHistoryCreated$: Stream<OrderHistory>;
    onIFDOCOOrdersLoaded$: Stream<object[]>;
    onOrderCreated$: Stream<object>;
    onOrdersLoaded$: Stream<object[]>;
    onPositionsLoaded$: Stream<Position>;
    onPriceChanged$: Stream<number>;
    onSizeChanged$: Stream<number>;
    onStopOrdersLoaded$: Stream<StopOrder[]>;
    onPriceWidthChanged$: Stream<number>;
    onRatioChanged$: Stream<number>;
}

export const intent = (sources: Sources): Actions => {
    const onApiKeyLoaded$ = (sources.storage as any).local.getItem("api-key")
        .filter((apiKey: string) => apiKey && apiKey !== "")
        .take(1);

    const onApiSecretLoaded$ = (sources.storage as any).local.getItem("api-secret")
        .filter((apiSecret: string) => apiSecret && apiSecret !== "")
        .take(1);

    const onCancelOrders$ = sources.HTTP.select("cancel-orders")
        .map((response$) => response$.replaceError(() => Stream.never()))
        .flatten()
        .mapTo(null);

    const onClickClearButton$ = sources.DOM.select(".clear-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onClickClearOrderButton$ = sources.DOM.select(".clear-order-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onClickGroupSizePlusButton$ = sources.DOM.select(".board-header").select(".plus")
        .events("click")
        .mapTo(null);

    const onClickGroupSizeMinusButton$ = sources.DOM.select(".board-header").sele