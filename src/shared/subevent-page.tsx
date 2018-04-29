import * as React from 'react'
import { Helmet } from 'react-helmet'
import { NavLink } from 'react-router-dom'

import { Event, SubEventDetails } from '@truesparrow/content-sdk-js'

import * as config from './config'

import * as text from './subevent-page.text'


export function subEventPage(event: Event, subEvent: SubEventDetails) {
    return class extends React.PureComponent<{}, {}> {
        render() {
            const pageTitle = `${event.title} - ${subEvent.title[config.LANG()]}`;
            const addressEncoded = encodeURIComponent(subEvent.address);

            return (
                <div
                    className="subevent-page"
                    style={{
                        backgroundColor: subEvent.display.color
                    }}>
                    <Helmet>
                        <title>{pageTitle}</title>
                        <meta name="description" content={pageTitle} />
                        <link rel="canonical" href={`${config.EXTERNAL_ORIGIN}/${subEvent.slug}`} />
                        <meta name="robots" content="index,follow" />
                    </Helmet>
                    <h2 className="subevent-page-title">
                        <span className={'subevent-page-glyph ' + subEvent.display.icon}></span>
                        <span>
                            {subEvent.title[config.LANG()]}
                        </span>
                        <NavLink
                            className="subevent-page-close"
                            to="/"
                            exact>
                            <span className="subevent-page-glyph close"></span>
                        </NavLink>
                    </h2>
                    <p className="subevent-page-location-date-time">
                        <span>{text.where[config.LANG()]} : {subEvent.address}</span>
                        <span>{text.when[config.LANG()]} : {subEvent.dateAndTime.toString()}</span>
                    </p>
                    <div className="subevent-page-map">
                        <iframe
                            src={`https://www.google.com/maps/embed/v1/place?q=${addressEncoded}&zoom=17&key=${config.GOOGLE_MAPS_API_KEY}`}>
                        </iframe>
                    </div>
                </div >
            );
        }
    }
}
