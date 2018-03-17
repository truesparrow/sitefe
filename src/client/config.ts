import { MarshalFrom } from 'raynor'

import { Context, Env } from '@truesparrow/common-js'
import { Session } from '@truesparrow/identity-sdk-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;

// Common to all services

export const ENV: Env = clientConfig.env;
export const CONTEXT: Context = Context.Client;

export const CONTENT_SERVICE_HOST: string = clientConfig.contentServiceHost;
export const GOOGLE_MAPS_API_KEY: string = clientConfig.googleMapsApiKey;
export const ROLLBAR_CLIENT_TOKEN: string | null = clientConfig.rollbarClientToken;

// Specific to sitefe services

export const NAME: string = 'sitefe';
export const ORIGIN: string = clientConfig.originWithSubDomain;
export const SUBDOMAIN: string = clientConfig.subDomain;

// * Per-session "globals"

export const SESSION: () => Session = () => clientConfig.session;
export const LANG: () => string = () => clientConfig.language;
