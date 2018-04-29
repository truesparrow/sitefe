/// <reference types="cypress" />

import { Event } from '@truesparrow/content-sdk-js'
import { Session } from '@truesparrow/identity-sdk-js'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'

declare global {
    namespace Cypress {
        interface Chainable<Subject> {
            clearOutData(): Chainable<Response>;
            loginAsUser(userFixture: string): Chainable<[SessionToken, Session, any]>;
            addEvent(sessionToken: SessionToken, userFixture: string): Chainable<Event>;
            visitSiteFe(url: string, options?: any, notInitial?: boolean): Chainable<Subject>;
            requestSiteFe(url: string): Chainable<Response>;
        }
    }
}
