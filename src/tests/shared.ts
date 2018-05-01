export const IDENTITY_SERVICE_HOST = Cypress.env('IDENTITY_SERVICE_HOST');
export const IDENTITY_SERVICE_PORT = Cypress.env('IDENTITY_SERVICE_PORT');
export const CONTENT_SERVICE_HOST = Cypress.env('CONTENT_SERVICE_HOST');
export const CONTENT_SERVICE_PORT = Cypress.env('CONTENT_SERVICE_PORT');

export const ADMINFE_EXTERNAL_DOMAIN = Cypress.env('COMMON_ADMINFE_EXTERNAL_DOMAIN');
export const ORIGIN_DOMAIN = Cypress.env('HOST');
export const ORIGIN_PORT = Cypress.env('PORT');
export const ORIGIN = `http://${ORIGIN_DOMAIN}:${ORIGIN_PORT}`;
export const ORIGIN_DOMAIN_AND_PORT = `${ORIGIN_DOMAIN}:${ORIGIN_PORT}`;

export const CONTACT_AUTHORS = 'The TruSpar Team';
export const CONTACT_EMAIL = Cypress.env('CONTACT_EMAIL');
export const STYLE_PRIMARY_COLOR = '#1498d5';

export const FACEBOOK_APP_ID = String(Cypress.env('FACEBOOK_APP_ID'));


interface PageInfo {
    path: string;
    title: string;
    robotsMeta: string;
    startDateStr?: string;
    locationName?: string;
    skipCanonical?: boolean;
    failOnStatusCode?: boolean;
    breadcrumbName?: string;
}


export const ALL_EVENT1_PAGES: PageInfo[] = [
    {
        path: '',
        title: 'Our wedding',
        robotsMeta: 'index,follow',
        startDateStr: '2018-03-13T12:54:16.721Z',
        locationName: 'Bucharest City Hall, Bulevardul Regina Elisabeta, Bucharest, Romania'
    },
    {
        path: 'civil-ceremony',
        title: 'Our wedding - Civil Ceremony',
        robotsMeta: 'index,follow',
        breadcrumbName: 'Civil Ceremony',
        startDateStr: '2018-03-13T12:54:16.721Z',
        locationName: 'Bucharest City Hall, Bulevardul Regina Elisabeta, Bucharest, Romania'
    },
    {
        path: 'religious-ceremony',
        title: 'Our wedding - Religious Ceremony',
        robotsMeta: 'index,follow',
        breadcrumbName: 'Religious Ceremony',
        startDateStr: '2018-03-13T12:54:16.721Z',
        locationName: 'Biserica Icoanei, Strada Icoanei, Bucharest, Romania'
    },
    {
        path: 'reception',
        title: 'Our wedding - Reception',
        robotsMeta: 'index,follow',
        breadcrumbName: 'Reception',
        startDateStr: '2018-03-13T12:54:16.721Z',
        locationName: 'Scala Events, Bulevardul Mircea Eliade, Bucharest, Romania'
    },
    {
        path: 'inexistent-page',
        title: 'Page Not Found',
        robotsMeta: 'noindex,nofollow',
        skipCanonical: true,
        failOnStatusCode: false
    },
];
