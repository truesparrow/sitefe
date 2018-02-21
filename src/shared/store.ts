import { combineReducers, createStore, Reducer, Store } from 'redux'

import { Event } from '@truesparrow/content-sdk-js'

import { ClientInitialState } from './client-data'


export enum StatePart {
    Event = 0
}


export enum OpState {
    Init = 0,
    Preloaded = 1,
    Loading = 2,
    Ready = 3,
    Failed = 4
}


export interface EventInit {
    part: StatePart.Event,
    type: OpState.Init;
}
export interface EventPreloaded {
    part: StatePart.Event,
    type: OpState.Preloaded;
    event: Event;
}
export interface EventLoading {
    part: StatePart.Event,
    type: OpState.Loading;
}
export interface EventReady {
    part: StatePart.Event;
    type: OpState.Ready;
    event: Event;
}
export interface EventFailed {
    part: StatePart.Event;
    type: OpState.Failed;
    eventIsMissing: boolean;
    errorMessage: string;
}

export type EventState =
    EventInit | EventPreloaded | EventLoading | EventReady | EventFailed;

const fooInitialState: EventState = {
    part: StatePart.Event,
    type: OpState.Init
};

function event(state = fooInitialState, action: EventState): EventState {
    if (action.part != StatePart.Event) {
        return state;
    }

    switch (action.type) {
        case OpState.Preloaded:
        case OpState.Init:
        case OpState.Loading:
        case OpState.Ready:
        case OpState.Failed:
            return action;
        default:
            return state;
    }
}



export const reducers: Reducer<any> = combineReducers({
    event: event
});


export function createStoreFromInitialState(reducers: Reducer<any>, clientInitialState: ClientInitialState): Store<any> {
    const store = createStore(reducers);

    if (clientInitialState.eventIsMissing) {
        store.dispatch({
            part: StatePart.Event,
            type: OpState.Failed,
            eventIsMissing: true,
            errorMessage: 'Event is missing'
        });
    }

    if (clientInitialState.event != null) {
        store.dispatch({
            part: StatePart.Event,
            type: OpState.Preloaded,
            event: clientInitialState.event
        });
    }

    return store;
}
