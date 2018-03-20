import 'mocha'

import { Env } from '@truesparrow/common-js'

import { ORIGIN_DOMAIN_AND_PORT } from './shared'


describe('sitefe', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('Large scale SEO & Web integration', () => {
        describe('favicon.ico', () => {
            it('Should be referenced by pages', () => {
                // TODO
            });

            it('Should exist', () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(event => {
                        cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'real/client/favicon.ico');
                    })
                });
            })
        });

        describe('robots.txt', () => {
            it('Should exist', () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(event => {
                        cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'robots.txt');
                    });
                });
            })
        });

        describe('humans.txt', () => {
            it('Should exist', () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(event => {
                        cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'humans.txt');
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
    });
});
