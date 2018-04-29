import { MarshalFrom } from 'raynor'
import * as uuid from 'uuid'

import { PrivateEventResponse } from '@truesparrow/content-sdk-js/dtos'
import { SESSION_TOKEN_COOKIE_NAME, SESSION_TOKEN_HEADER_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionAndTokenResponse } from '@truesparrow/identity-sdk-js/dtos'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'

import { ADMINFE_EXTERNAL_DOMAIN, ORIGIN, IDENTITY_SERVICE_HOST, CONTENT_SERVICE_HOST, IDENTITY_SERVICE_PORT, CONTENT_SERVICE_PORT } from './shared'


let uniquor = 0;


function clearOutData() {
    cy.request({
        url: `http://${IDENTITY_SERVICE_HOST}:${IDENTITY_SERVICE_PORT}/test/clear-out`,
        method: 'POST',
        headers: {
            Origin: ORIGIN
        }
    });
    cy.request({
        url: `http://${CONTENT_SERVICE_HOST}:${CONTENT_SERVICE_PORT}/test/clear-out`,
        method: 'POST',
        headers: {
            Origin: ORIGIN
        }
    });
}

function loginAsUser(userFixture: string) {
    const sessionTokenMarshaller = new (MarshalFrom(SessionToken))();
    const sessionAndTokenResponseMarsahaller = new (MarshalFrom(SessionAndTokenResponse))();

    cy.fixture(userFixture).then(userData => {
        const newUserData = Object.assign({}, userData, { sub: uuid() });
        cy.request({
            url: `http://${IDENTITY_SERVICE_HOST}:${IDENTITY_SERVICE_PORT}/test/create-test-user`,
            method: 'POST',
            headers: {
                Origin: ORIGIN
            },
            body: newUserData
        }).then(response => {
            const sessionAndTokenResponse = sessionAndTokenResponseMarsahaller.extract(response.body);
            cy.setCookie(
                SESSION_TOKEN_COOKIE_NAME,
                'j:' + encodeURIComponent(JSON.stringify(sessionTokenMarshaller.pack(sessionAndTokenResponse.sessionToken))), {
                    domain: ADMINFE_EXTERNAL_DOMAIN
                }
            ).then(_newCookie => {
                return [sessionAndTokenResponse.sessionToken, sessionAndTokenResponse.session, newUserData];
            });
        });
    });
}

function addEvent(sessionToken: SessionToken, eventFixture: string) {
    const privateEventResponseMarshaller = new (MarshalFrom(PrivateEventResponse))();

    cy.fixture(eventFixture).then(eventData => {
        const newEventData = Object.assign({}, eventData, { subDomain: eventData.subDomain + '-' + uniquor++ });
        cy.request({
            url: `http://${CONTENT_SERVICE_HOST}:${CONTENT_SERVICE_PORT}/test/add-event`,
            method: 'POST',
            headers: {
                Origin: ORIGIN,
                [SESSION_TOKEN_HEADER_NAME]: JSON.stringify(sessionToken)
            },
            body: newEventData
        }).then(response => {
            return privateEventResponseMarshaller.extract(response.body).event;
        });
    });
}

function visitSiteFe(url: string, notInitial?: boolean) {
    const theUrl = new URL(url);
    const subdomain = theUrl.hostname.split('.')[0];
    const rest = theUrl.hostname.split('.').splice(1).join('.');
    const restUrl = url.replace(`${subdomain}.`, '');
    if (typeof notInitial == 'undefined') {
        cy.clearCookies();
    }
    cy.setCookie('truesparrow-subdomain', subdomain, { domain: rest });
    cy.visit(restUrl);
}

function requestSiteFe(url: string) {
    const theUrl = new URL(url);
    const subdomain = theUrl.hostname.split('.')[0];
    const rest = theUrl.hostname.split('.').splice(1).join('.');
    const restUrl = url.replace(`${subdomain}.`, '');
    cy.setCookie('truesparrow-subdomain', subdomain, { domain: rest });
    return cy.request(restUrl);
}


Cypress.Commands.add('clearOutData', clearOutData);
Cypress.Commands.add('loginAsUser', loginAsUser);
Cypress.Commands.add('addEvent', addEvent);
Cypress.Commands.add('visitSiteFe', visitSiteFe);
Cypress.Commands.add('requestSiteFe', requestSiteFe);
