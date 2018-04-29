import * as React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import { EventState, OpState } from './store'

// import * as text from './home-page.text'


interface Props {
    event: Event;
}

interface State {
}


class _HomePage extends React.Component<Props, State> {
    render() {
        const { event } = this.props;

        const subEventNavLinks = event.subEventDetails
            .filter(subEvent => subEvent.haveEvent)
            .map(subEvent => {
                return (
                    <NavLink
                        key={subEvent.slug}
                        className="home-page-link"
                        style={{
                            backgroundColor: subEvent.display.color
                        }}
                        to={`/${subEvent.slug}`} exact>
                        <span className={'home-page-link-glyph ' + subEvent.display.icon}></span>
                        <strong className="home-page-link-title">
                            {subEvent.title[config.LANG()]}
                        </strong>
                    </NavLink>
                );
            });

        return (
            <div className="home-page">
                <Helmet>
                    <title>{event.title}</title>
                    <meta name="description" content={event.title} />
                    <link rel="canonical" href={`${config.EXTERNAL_ORIGIN}/`} />
                    <meta name="robots" content="index,follow" />
                </Helmet>
                {subEventNavLinks}
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
