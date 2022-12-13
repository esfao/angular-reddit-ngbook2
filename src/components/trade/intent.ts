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

    const onClickGroupSizeMinusButton$ = sources.DOM.select(".board-header").select(".minus")
        .events("click")
        .mapTo(null);

    const onClickMarketBuyButton$ = sources.DOM.select(".market-order-buttons").select(".buy-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onClickMarketSellButton$ = sources.DOM.select(".market-order-buttons").select(".sell-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onClickLimitBuyButton$ = sources.DOM.select(".limit-order-buttons").select(".buy-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onClickLimitSellButton$ = sources.DOM.select(".limit-order-buttons").select(".sell-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onExecutionCreated$ = sources.socket.execution$;

    const onHistoryCreated$ = Stream.merge(
        sources.HTTP.select("market-order").map((stream) => createHistoryStream("Market", stream)).flatten(),
        sources.HTTP.select("limit-order").map((stream) => createHistoryStream("Limit", stream)).flatten(),
        sources.HTTP.select("ifdoco-order").map((stream) => createIFDOCOHistoryStream(stream)).flatten(),
    );

    const onIFDOCOOrdersLoaded$ = sources.HTTP.select("parent-orders")
        .map((response$) => response$.replaceError(() => Stream.never()))
        .flatten()
        .map((response) => JSON.parse(response.text))
        .filter((orders) => orders.filter((o: any) => o.parent_order_type === "IFDOCO"));

    const onOrderCreated$ = sources.HTTP.select("market-order")
        .map((response$) => response$.replaceError(() => Stream.never()))
        .flatten()
        .map((response) => JSON.parse(response.text));

    const onOrdersLoaded$ = sources.HTTP.select("orders")
        .map((response$) => response$.replaceError(() => Stream.never()))
        .flatten()
        .map((response) => JSON.parse(response.text));

    const onStopOrdersLoaded$ = Stream.combine(
        sources.HTTP.select("parent-orders")
            .map((response$) => response$.replaceError(() => Stream.never()))
            .flatten()
            .map((response) => JSON.parse(response.text))
            .filter((o) => o.parent_order_type === "STOP")
            .map((orders) => orders.map((o: any) => new StopOrder(o)))
            .startWith([]),
        sources.HTTP.select("parent-order")
            .map((response$) => response$.replaceError(() => Stream.never()))
            .flatten()
            .map((response) => JSON.parse(response.text))
            .map((o) => o.parameters.filter((or: any) => or.condition_type === "STOP"))
            .map((orders) => orders.map((o: any) => new StopOrder(o)))
            .startWith([]),
    ).map(([s1, s2]) => s1.concat(s2));

    const onPositionsLoaded$ = sources.HTTP.select("positions")
        .map((response$) => response$.replaceError(() => Stream.never()))
        .flatten()
        .map((response) => JSON.parse(response.text))
        .map((positions) => new Position(positions));

    const onPriceChanged$ = sources.DOM.select("#price-input")
        .events("keyup")
        .map((event) => event.target as HTMLInputElement)
        .map((element) => +element.value);

    const onSizeChanged$ = sources.DOM.select("#size-input")
        .events("keyup")
        .map((event) => event.target as HTMLInputElement)
        .map((element) => +element.value);

    const onPriceWidthChanged$ = sources.DOM.select("#price-width-input")
        .events("keyup")
        .map((event) => event.target as HTMLInputElement)
        .map((element) => +element.value);

    const onRatioChanged$ = sources.DOM.select("#ratio-input")
        .events("keyup")
        .map((event) => event.target as HTMLInputElement)
        .map((element) => +element.value);

    const onClickIFDOCOBuyButton$ = sources.DOM.select(".ranged-ifdoco-order-buttons").select(".buy-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    const onClickIFDOCOSellButton$ = sources.DOM.select(".ranged-ifdoco-order-buttons").select(".sell-button")
        .events("click", { preventDefault: true })
        .mapTo(null);

    return {
        onApiKeyLoaded$,
        onApiSecretLoaded$,
        onCancelOrders$,
        onClic