import * as React from 'react'
import { connect } from 'react-redux'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import { EventState, OpState } from './store'

import * as text from './home-page.text'


interface Props {
    event: Event;
}

interface State {
}


class _HomePage extends React.Component<Props, State> {
    render() {
        return (
            <div>
                {text.homePage[config.LANG()]}
            </div>
        );
    }
}

function stateToProps(state: any) {
    if (state.event.type != OpState.Preloaded && state.event.type != OpState.Ready) {
        throw new Error('Should not mount this component when things are not ready');
    }

    return {
        event: state.event.event as Event
    };
}

function dispatchToProps(_dispatch: (newState: EventState) => void) {
    return {};
}

export const HomePage = connect(stateToProps, dispatchToProps)(_HomePage);
