import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { Event } from '@truesparrow/content-sdk-js'

import * as config from './config'
import * as commonText from './common.text'
import { HomePage } from './home-page'
import { NotFoundPage } from './not-found-page'
import * as services from './services'
import { subEventPage } from './subevent-page'
import { EventState, OpState, StatePart } from './store'

import * as text from './app-frame.text'


export interface Props {
    location: Location;
    isPreloaded: boolean;
    isLoading: boolean;
    isReady: boolean;
    isFailedAndMissing: boolean;
    isFailed: boolean;
    event: Event | null;
    errorMessage: string | null;
    onEventLoading: () => void;
    onEventReady: (event: Event) => void;
    onEventFailedAndMissing: () => void;
    onEventFailed: (errorMessage: string) => void;
}

export interface State {
}

class _AppFrame extends React.Component<Props, State> {
    async componentDidMount() {
        // If it's preloaded or already failed and missing at the mount point then the server did
        // all the work.
        if (this.props.isPreloaded || this.props.isFailedAndMissing) {
            return;
        }

        this.props.onEventLoading();

        try {
            const event = await services.CONTENT_PUBLIC_CLIENT().getEventBySubDomain(config.SUBDOMAIN);
            this.props.onEventReady(event);
        } catch (e) {
            if (e.name == 'EventNotFoundError') {
                this.props.onEventFailedAndMissing();
            } else {
                console.log(e);
                services.ROLLBAR_CLIENT().error(e);
                this.props.onEventFailed('Could not load event for user');
            }
        }
    }

    render() {
        const helmet =
            <Helmet>
                <title>{text.pageTitle[config.LANG()]}</title>
            </Helmet>;

        if (this.props.isLoading) {
            return (
                <div className="loading">
                    {helmet}
                    <span className="message">{commonText.loading[config.LANG()]}</span>
                </div>
            );
        } else if (this.props.isFailedAndMissing) {
            return <NotFoundPage />;
        } else if (this.props.isFailed) {
            return (
                <div className="failed">
                    {helmet}
                    <span className="message">{commonText.loadingFailed[config.LANG()]}</span>
                </div>
            );
        } else {
            const event = this.props.event as Event;

            const subEventNavLinks = event.subEventDetails
                .filter(subEvent => subEvent.haveEvent)
                .map(subEvent => {
                    return (
                        <NavLink
                            key={subEvent.slug}
                            to={`/${subEvent.slug}`} exact>
                            {subEvent.slug}
                        </NavLink>
                    );
                });

            const subRoutes = event.subEventDetails
                .filter(subEvent => subEvent.haveEvent)
                .map(subEvent => {
                    return (
                        <Route
                            key={subEvent.slug}
                            exact
                            path={`/${subEvent.slug}`}
                            component={subEventPage(subEvent)} />
                    );
                });

            return (
                <div>
                    <header>
                        <NavLink to="/" exact>{text.home[config.LANG()]}</NavLink>
                        {subEventNavLinks}
                    </header>
                    <main>
                        <Switch>
                            <Route exact path="/" component={HomePage} />
                            {subRoutes}
                            <Route path="*" component={NotFoundPage} />
                        </Switch>
                    </main>
                </div>
            );
        }
    }
}


function stateToProps(state: any) {
    return {
        isPreloaded: state.event.type == OpState.Preloaded,
        isLoading: state.event.type == OpState.Init || state.event.type == OpState.Loading,
        isReady: state.event.type == OpState.Ready,
        isFailedAndMissing: state.event.type == OpState.Failed && state.event.eventIsMissing,
        isFailed: state.event.type == OpState.Failed,
        event: state.event.type == OpState.Ready || state.event.type == OpState.Preloaded ? state.event.event : null,
        errorMessage: state.event.type == OpState.Failed ? state.event.errorMessage : null
    };
}


function dispatchToProps(dispatch: (newState: EventState) => void) {
    return {
        onEventLoading: () => dispatch({ part: StatePart.Event, type: OpState.Loading }),
        onEventReady: (event: Event) => dispatch({ part: StatePart.Event, type: OpState.Ready, event }),
        onEventFailedAndMissing: () => dispatch({ part: StatePart.Event, type: OpState.Failed, eventIsMissing: true, errorMessage: 'Event is missing' }),
        onEventFailed: (errorMessage: string) => dispatch({ part: StatePart.Event, type: OpState.Failed, eventIsMissing: false, errorMessage })
    };
}


export const AppFrame = withRouter(connect(stateToProps, dispatchToProps)(_AppFrame as any));
