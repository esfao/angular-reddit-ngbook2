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
    histo