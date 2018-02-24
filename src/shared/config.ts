import { getNamespace } from 'continuation-local-storage'
import { config } from 'dotenv'

import { Context, Env, parseContext, parseEnv, isOnServer } from '@truesparrow/common-js'
import { getFromEnv } from '@truesparrow/common-server-js'
import { Session } from '@truesparrow/identity-sdk-js'


config();


export const CLS_NAMESPACE_NAME: string = 'truesparrow.request';
export const NAME: string = 'sitefe';
export const ENV: Env = parseEnv(getFromEnv('ENV'));
export const CONTEXT: Context = parseContext(getFromEnv('CONTEXT'));
export const ADDRESS: string = getFromEnv('ADDRESS');
export const PORT: number = parseInt(getFromEnv('PORT'), 10);
export const ORIGIN: string = getFromEnv('ORIGIN');
const originWithSubdomain: string = getFromEnv('ORIGIN_WITH_SUBDOMAIN');
export const ORIGIN_WITH_SUBDOMAIN = (subDomain: string) => originWithSubdomain.replace('{0}', subDomain);
export const SUBDOMAIN: string = 'DONT_USE_THIS_VALUE_SERVER_SIDE';
export const IDENTITY_SERVICE_HOST: string = getFromEnv('IDENTITY_SERVICE_HOST');
export const CONTENT_SERVICE_HOST: string = getFromEnv('CONTENT_SERVICE_HOST');
export const GOOGLE_MAPS_API_KEY: string = getFromEnv('GOOGLE_MAPS_API_KEY');
export const LOGGLY_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('LOGGLY_TOKEN') : null;
export const LOGGLY_SUBDOMAIN: string | null = isOnServer(ENV) ? getFromEnv('LOGGLY_SUBDOMAIN') : null;
export const ROLLBAR_SERVER_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('ROLLBAR_SERVER_TOKEN') : null;
export const ROLLBAR_CLIENT_TOKEN: string | null = isOnServer(ENV) ? getFromEnv('ROLLBAR_CLIENT_TOKEN') : null;
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
