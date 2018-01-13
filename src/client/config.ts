import { MarshalFrom } from 'raynor'

import { Env } from '@truesparrow/common-js'

import { ClientConfig } from '../shared/client-data'


const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();

const clientConfig = clientConfigMarshaller.extract((window as any).__TRUESPARROW_CLIENT_CONFIG);
delete (window as any).__TRUESPARROW_CLIENT_CONFIG;


export const NAME: string = 'sitefe';
export const ENV: Env = clientConfig.env;
export const ORIGIN: string = clientConfig.origin;
export const ROLLBAR_CLIENT_TOKEN: string | null = clientConfig.rollbarClientToken;
export const SESSION = () => clientConfig.session;
export const LANG = () => clientConfig.language;
