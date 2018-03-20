import 'mocha'

import { Env } from '@truesparrow/common-js'

import { ORIGIN_DOMAIN_AND_PORT } from './shared'


describe('Subevent pages', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('Civil ceremony page', () => {
        it('Page structure', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    const subEvent = event.subEventDetails[0];
                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + subEvent.slug);

                    cy.get('div.subevent-page').within(() => {
                        cy.log('Header region');
                        cy.get(`span.subevent-page-glyph.${subEvent.display.icon}`).should('exist');
                        cy.contains(subEvent.title['en']);
                        cy.get('a.subevent-page-close');

                        cy.log('Location and time');
                        cy.contains(`Where : ${subEvent.address}`);
                        cy.contains(`When : ${subEvent.dateAndTime}`);

                        cy.log('Map');
                        cy.get('iframe').should('have.attr', 'src').then((src: any) => {
                            expect(src.startsWith(`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(subEvent.address)}&zoom=17&key=`)).to.be.true;
                        });
                    });
                });
            });
        });

        it('Close button', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    const subEvent = event.subEventDetails[0];
                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + subEvent.slug);
                    cy.get('div.subevent-page a.subevent-page-close').click();
                    cy.url().should('eql', 'http://sitefe.local.truesparrow:10004/');
                });
            });
        });
    });

    describe('Religious ceremony page', () => {
        it('Page structure', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    const subEvent = event.subEventDetails[1];
                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + subEvent.slug);

                    cy.get('div.subevent-page').within(() => {
                        cy.log('Header region');
                        cy.get(`span.subevent-page-glyph.${subEvent.display.icon}`).should('exist');
                        cy.contains(subEvent.title['en']);
                        cy.get('a.subevent-page-close');

                        cy.log('Location and time');
                        cy.contains(`Where : ${subEvent.address}`);
                        cy.contains(`When : ${subEvent.dateAndTime}`);

                        cy.log('Map');
                        cy.get('iframe').should('have.attr', 'src').then((src: any) => {
                            expect(src.startsWith(`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(subEvent.address)}&zoom=17&key=`)).to.be.true;
                        });
                    });
                });
            });
        });

        it('Close button', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    const subEvent = event.subEventDetails[1];
                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + subEvent.slug);
                    cy.get('div.subevent-page a.subevent-page-close').click();
                    cy.url().should('eql', 'http://sitefe.local.truesparrow:10004/');
                });
            });
        });
    });

    describe('Reception page', () => {
        it('Page structure', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    const subEvent = event.subEventDetails[2];
                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + subEvent.slug);

                    cy.get('div.subevent-page').within(() => {
                        cy.log('Header region');
                        cy.get(`span.subevent-page-glyph.${subEvent.display.icon}`).should('exist');
                        cy.contains(subEvent.title['en']);
                        cy.get('a.subevent-page-close');

                        cy.log('Location and time');
                        cy.contains(`Where : ${subEvent.address}`);
                        cy.contains(`When : ${subEvent.dateAndTime}`);

                        cy.log('Map');
                        cy.get('iframe').should('have.attr', 'src').then((src: any) => {
                            expect(src.startsWith(`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(subEvent.address)}&zoom=17&key=`)).to.be.true;
                        });
                    });
                });
            });
        });

        it('Close button', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    const subEvent = event.subEventDetails[2];
                    cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + subEvent.slug);
                    cy.get('div.subevent-page a.subevent-page-close').click();
                    cy.url().should('eql', 'http://sitefe.local.truesparrow:10004/');
                });
            });
        });
    });
});
