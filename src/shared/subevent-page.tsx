import * as React from 'react'

import { SubEventDetails } from '@truesparrow/content-sdk-js'

import * as config from './config'


export function subEventPage(subEvent: SubEventDetails) {
    return class extends React.Component<{}, {}> {
        render() {
            const addressEncoded = encodeURIComponent(subEvent.address);
            return (
                <div>
                    {subEvent.title[config.LANG()]}
                    <iframe
                        src={`https://www.google.com/maps/embed/v1/place?q=${addressEncoded}&zoom=17&key=${config.GOOGLE_MAPS_API_KEY}`}>
                    </iframe>
                </div >
            );
        }
    }
}
