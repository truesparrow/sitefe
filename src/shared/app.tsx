import * as React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { HomePage } from './home'
import { NotFound } from './not-found'
import { PostPage } from './post'
import { FooState } from './store'


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
                    <title>A title</title>
                </Helmet>
                This is blog {this.props.fooText}
                <header>
                    <NavLink to="/" exact>Home</NavLink>
                    <NavLink to="/post">Post</NavLink>
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
