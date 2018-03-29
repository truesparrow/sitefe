import { getNamespace } from 'continuation-local-storage'
import { config } from 'dotenv'

import { Context, Env, parseContext, parseEnv } from '@truesparrow/common-js'
import { getFromEnv } from '@truesparrow/common-server-js'
import { Session } from '@truesparrow/identity-sdk-js'

config({ path: 'config/env.sitefe' });

export const ENV: Env = parseEnv(getFromEnv('ENV'));
export const CONTEXT: Context = parseContext(getFromEnv('CONTEXT'));

export const NAME: string = 'sitefe';
export const HOST: string = getFromEnv('HOST');
export const PORT: number = parseInt(getFromEnv('PORT'), 10);
export const ORIGIN: string = `http://${HOST}:${PORT}`;
export const ORIGIN_WITH_SUBDOMAIN = (subDomain: string) => `http://${subDomain}.${HOST}:${PORT}`;

export const IDENTITY_SERVICE_HOST: string = getFromEnv('IDENTITY_SERVICE_HOST');
export const IDENTITY_SERVICE_PORT: number = parseInt(getFromEnv('IDENTITY_SERVICE_PORT'), 10);
export const CONTENT_SERVICE_HOST: string = getFromEnv('CONTENT_SERVICE_HOST');
export const CONTENT_SERVICE_PORT: number = parseInt(getFromEnv('CONTENT_SERVICE_PORT'), 10);

export const GOOGLE_MAPS_API_KEY: string = getFromEnv('GOOGLE_MAPS_API_KEY');

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
