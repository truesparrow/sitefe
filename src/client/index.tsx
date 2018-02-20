import { MarshalFrom } from 'raynor'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './index.less'
import { AppFrame } from '../shared/app-frame'
import { ClientInitialState } from '../shared/client-data'
import { createStoreFromInitialState, reducers } from '../shared/store'

const clientInitialStateMarshaller = new (MarshalFrom(ClientInitialState))();

const clientInitialState = clientInitialStateMarshaller.extract((window as any).__TRUESPARROW_CLIENT_INITIAL_STATE);
delete (window as any).__TRUESPARROW_INITIAL_STATE;

const store = createStoreFromInitialState(reducers, clientInitialState);

ReactDOM.hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <AppFrame />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
