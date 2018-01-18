import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import * as config from './config'
import { HomePage } from './home'
import { NotFound } from './not-found'
import { PostPage } from './post'
import { FooState } from './store'

import * as text from './app.text'


export interface Props {
    fooText: string;
}

export interface State {
}

class _App extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <Helmet>
                    <title>{text.pageTitle[config.LANG()]}</title>
                </Helmet>
                {text.thisIsBlog[config.LANG()](this.props.fooText)}
                <header>
                    <NavLink to="/" exact>{text.home[config.LANG()]}</NavLink>
                    <NavLink to="/post">{text.post[config.LANG()]}</NavLink>
                </header>
                <main>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/post" component={PostPage} />
                        <Route path="*" component={NotFound} />
                    </Switch>
                </main>
            </div>
        );
    }
}


function stateToProps(state: any) {
    return {
        fooText: state.foo.text
    };
}


function dispatchToProps(_dispatch: (newState: FooState) => void) {
    return {};
}


export const App = withRouter(connect(stateToProps, dispatchToProps)(_App));
