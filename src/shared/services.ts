import * as Rollbar from 'rollbar'

import {
    ApiGatewayWebFetcher,
    isOnServer,
    envToString
} from '@truesparrow/common-js'
import { ContentPublicClient, newContentPublicClient } from '@truesparrow/content-sdk-js'

import * as config from './config'


const webFetcher = new ApiGatewayWebFetcher(config.ORIGIN);

const contentPublicClient = newContentPublicClient(
    config.ENV, config.ORIGIN, config.CONTENT_SERVICE_HOST, webFetcher);

const rollbarClient = new Rollbar({
    accessToken: isOnServer(config.ENV) ? (config.ROLLBAR_CLIENT_TOKEN as string) : 'FAKE_TOKEN_WONT_BE_USED_IN_LOCAL_OR_TEST',
    logLevel: 'warning',
    reportLevel: 'warning',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: isOnServer(config.ENV),
    payload: {
        // TODO: fill in the person field!
        serviceName: config.NAME,
        environment: envToString(config.ENV)
    }
});

export function CONTENT_PUBLIC_CLIENT(): ContentPublicClient {
    return contentPublicClient;
}

export function ROLLBAR_CLIENT(): Rollbar {
    return rollbarClient;
};
