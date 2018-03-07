import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { SubEventDetails } from '@truesparrow/content-sdk-js'

import * as config from './config'

import * as text from './subevent-page.text'


export function subEventPage(subEvent: SubEventDetails) {
    return class extends React.PureComponent<{}, {}> {
        render() {
            const addressEncoded = encodeURIComponent(subEvent.address);

            return (
                <div
                    className="subevent-page"
                    style={{
                        backgroundColor: subEvent.display.color
                    }}>
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
