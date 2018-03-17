import { getNamespace } from 'continuation-local-storage'

import { Context, Env, parseContext, parseEnv, isOnServer } from '@truesparrow/common-js'
import { getFromEnv } from '@truesparrow/common-server-js'
import { Session } from '@truesparrow/identity-sdk-js'

// Common to all services

export const ENV: Env = parseEnv(getFromEnv('COMMON_ENV'));
export const CONTEXT: Context = parseContext(getFromEnv('COMMON_CONTEXT'));

export const IDENTITY_SERVICE_HOST: string = getFromEnv('COMMON_IDENTITY_SERVICE_HOST');
export const CONTENT_SERVICE_HOST: string = getFromEnv('COMMON_CONTENT_SERVICE_HOST');

export const GOOGLE_MAPS_API_KEY: string = getFromEnv('COMMON_GOOGLE_MAPS_API_KEY');
export const LOGGLY_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_LOGGLY_TOKEN') : null;
export const LOGGLY_SUBDOMAIN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_LOGGLY_SUBDOMAIN') : null;
export const ROLLBAR_SERVER_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_ROLLBAR_SERVER_TOKEN') : null;
export const ROLLBAR_CLIENT_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('COMMON_ROLLBAR_CLIENT_TOKEN') : null;

// Specific to sitefe service

export const NAME: string = 'sitefe';
export const ADDRESS: string = getFromEnv('SITEFE_ADDRESS');
export const PORT: number = parseInt(getFromEnv('SITEFE_PORT'), 10);
export const ORIGIN: string = getFromEnv('SITEFE_ORIGIN');
const originWithSubdomain: string = getFromEnv('SITEFE_ORIGIN_WITH_SUBDOMAIN');
export const ORIGIN_WITH_SUBDOMAIN = (subDomain: string) => originWithSubdomain.replace('{0}', subDomain);

export const CLS_NAMESPACE_NAME: string = 'truesparrow.request';

// * Per-session "globals".

export const SUBDOMAIN: string = 'DONT_USE_THIS_VALUE_SERVER_SIDE';
export const SESSION: () => Session = () => {
    const namespace = getNamespace(CLS_NAMESPACE_NAME);
    const session = namespace.get('SESSION');
    return session;
};
export const LANG: () => string = () => {
    const namespace = getNamespace(CLS_NAMESPACE_NAME);
    const lang = namespace.get('LANG');
    return lang;
};
