import * as React from 'react'
import { Route } from 'react-router-dom'
import * as HttpStatus from 'http-status-codes'

import * as config from './config'

import * as text from './not-found.text'


export const NotFound = () => {
    return (
        <Route render={({ staticContext }) => {
            if (staticContext) {
                staticContext.status = HttpStatus.NOT_FOUND;
            }

            return (
                <div>
                    <h1>{text.notFound[config.LANG()]}</h1>
                </div>
            )
        }} />
    );
};
