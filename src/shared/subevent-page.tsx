import * as React from 'react'

import { SubEventDetails } from '@truesparrow/content-sdk-js'


export function subEventPage(subEvent: SubEventDetails) {
    return class extends React.Component<{}, {}> {
        render() {
            return <div>{subEvent.slug}</div>;
        }
    }
}
