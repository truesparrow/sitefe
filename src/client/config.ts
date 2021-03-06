import { MarshalFrom } from 'raynor'

import { Context, Env } from '@truesparrow/common-js'
import { Session } from '@truesparrow/identity-sdk-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;

export const ENV: Env = clientConfig.env;
export const CONTEXT: Context = Context.Client;

export const NAME: string = 'sitefe';
export const INTERNAL_ORIGIN: string = clientConfig.internalOrigin;
export const EXTERNAL_HOST: string = clientConfig.externalHost;
export const EXTERNAL_ORIGIN: string = clientConfig.externalOriginWithSubDomain;
export const SUBDOMAIN: string = clientConfig.subDomain;
export const SEO_TWITTER_HANDLE: string = clientConfig.seoTwitterHandle;
export const STYLE_APPLICATION_NAME: string = clientConfig.styleApplicationName;

export const CONTENT_SERVICE_HOST: string = clientConfig.contentServiceHost;
export const CONTENT_SERVICE_PORT: number = clientConfig.contentServicePort;

export const FACEBOOK_APP_ID: string = clientConfig.facebookAppId;
export const GOOGLE_MAPS_API_KEY: string = clientConfig.googleMapsApiKey;


// * Per-session "globals"

export const SESSION: () => Session = () => clientConfig.session;
export const LANG: () => string = () => clientConfig.language;
