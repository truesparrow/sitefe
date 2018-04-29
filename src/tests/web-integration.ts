import { expect } from 'chai'
import 'mocha'
import * as HttpStatus from 'http-status-codes'

import { Env } from '@truesparrow/common-js'

import { CONTACT_AUTHORS, CONTACT_EMAIL, ORIGIN_DOMAIN_AND_PORT, STYLE_PRIMARY_COLOR } from './shared'


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

    describe.only('sitemap.xml', () => {
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
});
