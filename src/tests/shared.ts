export const IDENTITY_SERVICE_HOST = Cypress.env('IDENTITY_SERVICE_HOST');
export const IDENTITY_SERVICE_PORT = Cypress.env('IDENTITY_SERVICE_PORT');
export const CONTENT_SERVICE_HOST = Cypress.env('CONTENT_SERVICE_HOST');
export const CONTENT_SERVICE_PORT = Cypress.env('CONTENT_SERVICE_PORT');

export const ADMINFE_EXTERNAL_DOMAIN = Cypress.env('COMMON_ADMINFE_EXTERNAL_DOMAIN');
export const ORIGIN_DOMAIN = Cypress.env('HOST');
export const ORIGIN_PORT = Cypress.env('PORT');
export const ORIGIN = `http://${ORIGIN_DOMAIN}:${ORIGIN_PORT}`;
export const ORIGIN_DOMAIN_AND_PORT = `${ORIGIN_DOMAIN}:${ORIGIN_PORT}`;
