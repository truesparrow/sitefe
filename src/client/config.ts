import { MarshalFrom } from 'raynor'

import { Context, Env } from '@truesparrow/common-js'
import { Session } from '@truesparrow/identity-sdk-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;


export const NAME: string = 'sitefe';
export const ENV: Env = clientConfig.env;
export const CONTEXT: Context = Context.Client;
export const ORIGIN: string = clientConfig.origin;
export const CONTENT_SERVICE_HOST: string = clientConfig.contentServiceHost;
export const ROLLBAR_CLIENT_TOKEN: string | null = clientConfig.rollbarClientToken;
export const SESSION: () => Session = () => clientConfig.session;
export const LANG: () => string = () => clientConfig.language;
