import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Route } from 'react-router-dom'
import * as HttpStatus from 'http-status-codes'

import * as config from './config'

import * as text from './not-found-page.text'


export const NotFoundPage = () => {
    return (
        <Route render={({ staticContext }) => {
            if (staticContext) {
                staticContext.status = HttpStatus.NOT_FOUND;
            }

            return (
                <div>
                    <Helmet>
                        <title>{text.pageTitle[config.LANG()]}</title>
                        <meta name="description" content={text.pageDescription[config.LANG()]} />
                        <meta name="robots" content="noindex,nofollow" />
                    </Helmet>
                    <h1>{text.notFound[config.LANG()]}</h1>
                </div>
            )
        }} />
    );
};
