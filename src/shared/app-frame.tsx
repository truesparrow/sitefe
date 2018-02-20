import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import * as config from './config'
import { HomePage } from './home-page'
import { NotFoundPage } from './not-found-page'
import { EventState } from './store'

import * as text from './app-frame.text'


export interface Props {
    // The event is null when it does not exist. Likely because we're accessing a subdomain which
    // isn't used.
    event: Event | null;
}

export interface State {
}

class _AppFrame extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{text.pageTitle[config.LANG()]}</title>
                </Helmet>
                <header>
                    <NavLink to="/" exact>{text.home[config.LANG()]}</NavLink>
                </header>
                <main>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </main>
            </div>
        );
    }
}


function stateToProps(state: any) {
    return {
        event: state.event.event
    };
}


function dispatchToProps(_dispatch: (newState: EventState) => void) {
    return {};
}


export const AppFrame = withRouter(connect(stateToProps, dispatchToProps)(_AppFrame));
