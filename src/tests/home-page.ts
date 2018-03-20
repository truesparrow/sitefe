import 'mocha'

import { Env } from '@truesparrow/common-js'

import { ORIGIN_DOMAIN_AND_PORT } from './shared'


describe('Home page', () => {
    before(() => {
        cy.clearOutData();
    });

    it('carousel looks alright', () => {
        cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
            cy.addEvent(sessionToken, 'event1.json').then(event => {
                cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT));

                for (let picture of event.pictureSet.pictures) {
                    cy.get('div.app-frame-carousel').get(`img.app-frame-carousel-image[src="${picture.mainImage.uri}"]`)
                        .should('have.attr', 'width', picture.mainImage.width.toString())
                        .and('have.attr', 'height', picture.mainImage.height.toString());
                    cy.get('div.app-frame-carousel').get(`img.app-frame-carousel-image.slidein[src="${picture.mainImage.uri}"]`, { timeout: 4000 });
                }
            });
        });
    });

    it('menus exist', () => {
        cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
            cy.addEvent(sessionToken, 'event1.json').then(event => {
                cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT));

                for (let subEvent of event.subEventDetails) {
                    cy.get('div.home-page').get(`a.home-page-link[href="/${subEvent.slug}"]`).as('link')
                        .should('have.attr', 'style', `background-color:${subEvent.display.color}`)
                        .contains(subEvent.title['en']);
                    cy.get('@link').within(() => {
                        cy.get(`span.home-page-link-glyph.${subEvent.display.icon}`).should('exist');
                    });
                }

                for (let subEvent of event.subEventDetails) {
                    cy.get('div.home-page').get(`a.home-page-link[href="/${subEvent.slug}"]`).click();
                    cy.url().should('include', subEvent.slug);
                    cy.go('back');
                }
            });
        });
    });

    it('menus exist event #2', () => {
        cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
            cy.addEvent(sessionToken, 'event2.json').then(event => {
                cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT));

                for (let subEvent of event.subEventDetails) {
                    cy.get('div.home-page').get(`a.home-page-link[href="/${subEvent.slug}"]`).as('link')
                        .should('have.attr', 'style', `background-color:${subEvent.display.color}`)
                        .contains(subEvent.title['en']);
                    cy.get('@link').within(() => {
                        cy.get(`span.home-page-link-glyph.${subEvent.display.icon}`).should('exist');
                    });
                }

                for (let subEvent of event.subEventDetails) {
                    cy.get('div.home-page').get(`a.home-page-link[href="/${subEvent.slug}"]`).click();
                    cy.url().should('include', subEvent.slug);
                    cy.go('back');
                }
            });
        });
    });
});
