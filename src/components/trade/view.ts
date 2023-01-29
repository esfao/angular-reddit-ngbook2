import {button, div, h4, hr, input, label, p, span, VNode} from "@cycle/dom";
import Stream from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import {State} from "./index";

export const view = (state$: Stream<State>, boardComponentDOM$: Stream<VNode>, summaryComponentDOM$: Stream<VNode>) =>
    state$
        .compose(sampleCombine(boardComponentDOM$))
        .compose(sampleCombine(summaryComponentDOM$))
        .map(([[state, boardComponentDOM], summaryComponentDOM]) =>
            div(".trade", [
                summaryComponentDOM,
                boardComponentDOM,
                div(".order", [
                    h4(".sub-title", "Size"),
                    div(".size", [
                        input("#size-input", { attrs: { value: state.size }}),
                    ]),
                    hr(),
                    h4(".sub-title", "Market"),
                    div(".market-order-buttons.order-buttons", [
                        button(".sell-button", { attrs: { disabled: state.isOrdering || state.size === 0 } }, "Sell"),
                        button(".buy-button", { attrs: { disabled: state.isOrdering || state.size === 0 } }, "Buy"),
                    ]),
                    hr(),
                    h4(".sub-title", "Limit"),
                    div(".limit-order-buttons.order-buttons", [
                        input("#price-input", { attrs: { value: state.price }}),
                        button(".sell-button", { attrs: { disabled: state.isOrdering || state.size === 0 