import 'mocha'
import * as HttpStatus from 'http-status-codes'

import { Env } from '@truesparrow/common-js'

import { CONTACT_AUTHORS, CONTACT_EMAIL, ORIGIN_DOMAIN_AND_PORT } from './shared'


describe('Large scale SEO & Web integration', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('favicon.ico', () => {
        it('Should be referenced by pages', () => {
            // TODO
        });

        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/android-chrome-192x192.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/android-chrome-512x512.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/apple-touch-icon.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/mstile-150x150.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/mstile-310x310.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/favicon-32x32.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/favicon-16x16.png');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/safari-pinned-tab.svg');
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/favicon.ico');
                })
            });
        });
    });

    describe.only('robots.txt', () => {
        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'robots.txt').then(resp => {
                        expect(resp.status).to.eq(HttpStatus.OK);
                        expect(resp.headers['content-type']).to.eq('text/plain; charset=utf-8');
                        expect(resp.body).to.eql(`Sitemap: ${event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT)}sitemap.xml
`);
                    });
                });
            });
        })
    });

    describe('humans.txt', () => {
        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'humans.txt').then(resp => {
                        expect(resp.status).to.eq(HttpStatus.OK);
                        expect(resp.headers['content-type']).to.eq('text/plain; charset=utf-8');
                        expect(resp.body).to.eql(`/* Team */
Programmer: ${CONTACT_AUTHORS}
Contact: ${CONTACT_EMAIL}
`);
                    });
                });
            });
        })
    });

    describe('sitemap.xml', () => {
        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'sitemap.xml');
                });
            });
        })
    });

    describe('browserconfig.xml', () => {
        it('Should exist', () => {
            cy.request('/browserconfig.xml');
        });
    });

    describe('site.webmanifest', () => {
        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'site.webmanifest');
                });
            });
        });
    });
});
