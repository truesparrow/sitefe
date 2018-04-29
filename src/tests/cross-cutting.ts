import { expect } from 'chai'
import * as chai from 'chai'
import { JSONCookie } from 'cookie-parser'
import 'mocha'
import { MarshalFrom } from 'raynor'
import { raynorChai } from 'raynor-chai'

import { Env } from '@truesparrow/common-js'
import { SESSION_TOKEN_COOKIE_NAME } from '@truesparrow/identity-sdk-js/client'
import { SessionToken } from '@truesparrow/identity-sdk-js/session-token'

import { ORIGIN_DOMAIN, ORIGIN_DOMAIN_AND_PORT } from './shared'


chai.use(raynorChai);

describe('Cross-cutting concerns', () => {
    before(() => {
        cy.clearOutData();
    });

    const sessionTokenMarshaller = new (MarshalFrom(SessionToken))();

    it('Should set a cookie for the session', () => {
        cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
            cy.addEvent(sessionToken, 'event1.json').then(event => {
                cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT));
                cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                    expect(cookie).has.property('domain').and.eql(ORIGIN_DOMAIN);
                    expect(cookie).has.property('path').and.eql('/');
                    expect(cookie).has.property('httpOnly').and.eql(true);
                    expect(cookie).has.property('secure').and.eql(false);
                    expect(cookie).has.property('value');
                    const newSessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                    expect(newSessionTokenRaw).to.be.raynor(sessionTokenMarshaller);
                    const newSessionToken = sessionTokenMarshaller.extract(newSessionTokenRaw);

                    // The session set on this domain is different from another one.
                    expect(newSessionToken.sessionId).to.not.eql(sessionToken.sessionId);
                    expect(newSessionToken.userToken).to.be.null;
                });
            });
        });
    });

    it('Should maintain the session across navigation', () => {
        cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
            cy.addEvent(sessionToken, 'event1.json').then(event => {
                cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT));
                cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                    const sessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                    const sessionToken = sessionTokenMarshaller.extract(sessionTokenRaw);

                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'civil-ceremony', {}, true);
                    cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie2 => {
                        const sessionTokenRaw2 = JSONCookie(decodeURIComponent((cookie2 as any).value));
                        const sessionToken2 = sessionTokenMarshaller.extract(sessionTokenRaw2);

                        expect(sessionToken2).to.eql(sessionToken);
                    });
                });
            });
        });
    });

    it.skip('Should create a new session on another event', () => {
        cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
            cy.addEvent(sessionToken, 'event1.json').then(event => {
                cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT));
                cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie => {
                    const sessionTokenRaw = JSONCookie(decodeURIComponent((cookie as any).value));
                    const sessionToken = sessionTokenMarshaller.extract(sessionTokenRaw);

                    cy.loginAsUser('user2.json').then(([sessionToken2, _session2, _data2]) => {
                        cy.addEvent(sessionToken2, 'event2.json').then(event2 => {

                            cy.visitSiteFe(event2.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT), {}, true);
                            cy.getCookie(SESSION_TOKEN_COOKIE_NAME).then(cookie2 => {
                                const sessionTokenRaw2 = JSONCookie(decodeURIComponent((cookie2 as any).value));
                                const sessionToken2 = sessionTokenMarshaller.extract(sessionTokenRaw2);

                                // TODO: wtf
                                expect(sessionToken2).to.eql(sessionToken);
                            });
                        });
                    });
                });
            });
        });
    });

    it('Should do SSR', () => {
        // TODO: do this here.
    })
});
