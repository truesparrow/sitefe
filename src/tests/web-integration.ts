import { expect } from 'chai'
import 'mocha'
import * as HttpStatus from 'http-status-codes'

import { Env } from '@truesparrow/common-js'

import {
    ALL_EVENT1_PAGES,
    CONTACT_AUTHORS,
    CONTACT_EMAIL,
    FACEBOOK_APP_ID,
    ORIGIN_DOMAIN_AND_PORT,
    STYLE_PRIMARY_COLOR
} from './shared'


describe('Large scale SEO & Web integration', () => {
    before(() => {
        cy.clearOutData();
    });

    describe('favicon.ico', () => {
        for (const { path, failOnStatusCode } of ALL_EVENT1_PAGES) {
            it(`/${path} should reference favicons`, () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(event => {
                        cy.visitSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + path, { failOnStatusCode: failOnStatusCode == undefined ? true : failOnStatusCode });
                        cy.get('head > link[rel=apple-touch-icon]')
                            .should('have.attr', 'sizes', '180x180')
                            .should('have.attr', 'href', '/real/client/apple-touch-icon.png');
                        cy.get('head > link[rel=icon][sizes=32x32]')
                            .should('have.attr', 'type', 'image/png')
                            .should('have.attr', 'href', '/real/client/favicon-32x32.png');
                        cy.get('head > link[rel=icon][sizes=16x16]')
                            .should('have.attr', 'type', 'image/png')
                            .should('have.attr', 'href', '/real/client/favicon-16x16.png');
                        cy.get('head > link[rel=mask-icon]')
                            .should('have.attr', 'href', '/real/client/safari-pinned-tab.svg')
                            .should('have.attr', 'color', '#5bbad5');
                        cy.get('head > link[rel=\'shortcut icon\']')
                            .should('have.attr', 'href', '/real/client/favicon.ico');
                        cy.get('head > meta[name=msapplication-TileColor]')
                            .should('have.attr', 'content', '#1498d5');
                        cy.get('head > meta[name=theme-color]')
                            .should('have.attr', 'content', '#1498d5');
                        cy.get('head > link[rel=manifest]')
                            .should('have.attr', 'href', '/site.webmanifest');
                        cy.get('head > meta[name=msapplication-config]')
                            .should('have.attr', 'content', '/browserconfig.xml');
                    });
                });
            });
        }

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

    describe('robots.txt', () => {
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
                    const homeUri = event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT);
                    cy.requestSiteFe(homeUri + 'sitemap.xml').then(resp => {
                        expect(resp.status).to.eq(HttpStatus.OK);
                        expect(resp.headers['content-type']).to.eq('application/xml; charset=utf-8');
                        expect(resp.body).to.contain(`<?xml version="1.0" encoding="utf-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`);
                        expect(resp.body).to.contain(`<loc>${homeUri}</loc>`);
                        expect(resp.body).to.contain(`<loc>${homeUri}civil-ceremony</loc>`);
                        expect(resp.body).to.contain(`<loc>${homeUri}religious-ceremony</loc>`);
                        expect(resp.body).to.contain(`<loc>${homeUri}reception</loc>`);
                    });
                });
            });
        })
    });

    describe('browserconfig.xml', () => {
        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'browserconfig.xml').then(resp => {
                        expect(resp.status).to.eq(HttpStatus.OK);
                        expect(resp.headers['content-type']).to.eq('application/xml; charset=utf-8');
                        expect(resp.body).to.contain(`<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/real/client/mstile-150x150.png"/>
            <square310x310logo src="/real/client/mstile-310x310.png"/>
            <TileColor>${STYLE_PRIMARY_COLOR}</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`);
                    });
                });
            });
        });
    });

    describe('site.webmanifest', () => {
        it('Should exist', () => {
            cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                cy.addEvent(sessionToken, 'event1.json').then(event => {
                    cy.requestSiteFe(event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + 'site.webmanifest').then(resp => {
                        expect(resp.status).to.eq(HttpStatus.OK);
                        expect(resp.headers['content-type']).to.eq('application/manifest+json; charset=utf-8');
                        expect(resp.body).to.eql(`{
    "name": "${event.title}",
    "short_name": "${event.title}",
    "icons": [
        {
            "src": "/real/client/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/real/client/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "${STYLE_PRIMARY_COLOR}",
    "background_color": "#ffffff",
    "start_url": "${event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT)}",
    "display": "standalone"
}
`);
                    });
                });
            });
        });
    });

    describe.only('Page-level machine information', () => {
        for (const { path, title, robotsMeta, failOnStatusCode, skipCanonical, breadcrumbName } of ALL_EVENT1_PAGES) {
            it(`/${path}`, () => {
                cy.loginAsUser('user1.json').then(([sessionToken, _session, _data]) => {
                    cy.addEvent(sessionToken, 'event1.json').then(event => {
                        const thePath = event.homeUri(Env.Local, ORIGIN_DOMAIN_AND_PORT) + path;
                        cy.visitSiteFe(thePath, { failOnStatusCode: failOnStatusCode == undefined ? true : failOnStatusCode });

                        // Language

                        cy.get('html').should('have.attr', 'lang', 'en');

                        // Page specific generic web configuration

                        cy.title().should('equal', title);
                        cy.get('head > meta[name=description]').should('have.attr', 'content', title);
                        if (!skipCanonical) {
                            cy.get('head > link[rel=canonical]').should('have.attr', 'href', thePath);
                        }

                        // Common generic web configuration

                        cy.get('head > meta[name=author]').should('have.attr', 'content', 'The TruSpar Team');
                        cy.get('head > link[rel=author]').should('have.attr', 'href', '/humans.txt');

                        // Robots configuration

                        cy.get('head > meta[name=robots]').should('have.attr', 'content', robotsMeta);

                        if (!skipCanonical) {
                            // Facebook OpenGraph

                            cy.get('head > meta[property=\'og:type\']').should('have.attr', 'content', 'website');
                            cy.get('head > meta[property=\'og:url\']').should('have.attr', 'content', thePath);
                            cy.get('head > meta[property=\'og:title\']').should('have.attr', 'content', title);
                            cy.get('head > meta[property=\'og:description\']').should('have.attr', 'content', title);
                            cy.get('head > meta[property=\'og:site_name\']').should('have.attr', 'content', 'TruSpar');
                            cy.get('head > meta[property=\'og:image\']').should('have.attr', 'content', 'http://localhost:10004/real/client/sparrow.jpg');
                            cy.get('head > meta[property=\'og:image:alt\']').should('have.attr', 'content', title);
                            cy.get('head > meta[property=\'fb:app_id\']').should('have.attr', 'content', FACEBOOK_APP_ID);

                            // Twitter Card

                            cy.get('head > meta[name=\'twitter:card\']').should('have.attr', 'content', 'summary');
                            cy.get('head > meta[name=\'twitter:title\']').should('have.attr', 'content', title);
                            cy.get('head > meta[name=\'twitter:description\']').should('have.attr', 'content', title);
                            cy.get('head > meta[name=\'twitter:creator\']').should('have.attr', 'content', '@trusparevents');
                            cy.get('head > meta[name=\'twitter:site\']').should('have.attr', 'content', '@trusparevents');
                            cy.get('head > meta[name=\'twitter:image\']').should('have.attr', 'content', 'http://localhost:10004/real/client/sparrow.jpg');
                        }

                        if (breadcrumbName != undefined) {
                            cy.get('head > script[type=\'application/ld+json\']').first().should('exist');
                            cy.get('head > script[type=\'application/ld+json\']').first().then($script => {
                                const breadcrumbs = JSON.parse($script.text());
                                const target = {
                                    '@context': 'http://schema.org',
                                    '@type': 'BreadcrumbList',
                                    'itemListElement': [{
                                        '@type': 'ListItem',
                                        'position': 1,
                                        'item': {
                                            '@id': thePath,
                                            'name': breadcrumbName
                                        }
                                    }]
                                };
                                expect(breadcrumbs).to.eql(target);
                            });
                        }
                    });
                });
            });
        }
    });
});
