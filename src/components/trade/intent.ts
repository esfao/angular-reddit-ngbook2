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
    onOrderCreated$: