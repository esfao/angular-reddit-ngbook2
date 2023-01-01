import {div, hr, li, span, ul} from "@cycle/dom";
import Stream from "xstream";
import {State} from "./index";

export const view = (state$: Stream<State>) =>
    state$.map((state) =>
        div(".summary", [
            div(".current-price", [
                span(".label", "Current price"),
                span(".number", state.currentPrice.toLocaleString()),
                span(".unit", "JPY"),
            ]),
            div(".position", [
                span(".label", "Position"),
                span(".number", state.position.toPriceString()),
                span(".unit", "JPY"),
            ]),
            div(".position-diff", [
                span(".label", "P