import { wrap } from 'async-middleware'
import * as compression from 'compression'
import { createNamespace } from 'continuation-local-storage'
import * as express from 'express'
import * as HttpStatus from 'http-status-codes'
import 'log-timestamp'
import * as Mustache from 'mustache'
import { MarshalFrom } from 'raynor'
import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom'
import * as webpack from 'webpack'
import * as theWebpackDevMiddleware from 'webpack-dev-middleware'
import * as serializeJavascript from 'serialize-javascript'

import { inferLanguage } from '@truesparrow/business-rules-js'
import {
    InternalWebFetcher,
    isLocal,
    WebFetcher
} from '@truesparrow/common-js'
import {
    newCommonServerMiddleware,
    newLocalCommonServerMiddleware,
    newNamespaceMiddleware,
    Request
} from '@truesparrow/common-server-js'
import {
    ContentPublicClient,
    Event,
    newContentPublicClient
} from '@truesparrow/content-sdk-js'
import {
    IdentityClient,
    newIdentityClient,
    RequestWithIdentity,
    Session
} from '@truesparrow/identity-sdk-js'
import {
    newApiGatewayRouter,
    newSessionMiddleware,
    SessionLevel,
    SessionInfoSource
} from '@truesparrow/identity-sdk-js/server'

import { CompiledBundles, Bundles, WebpackDevBundles } from './bundles'
import { AppFrame } from '../shared/app-frame'
import * as config from '../shared/config'
import { ClientConfig, ClientInitialState } from '../shared/client-data'
import { createStoreFromInitialState, reducers } from '../shared/store'


async function main() {
    // Global setup, but hidden inside main()
    // ********************

    const webpackConfig = require('../../webpack.config.js');

    const clientConfigMarshaller = new (MarshalFrom(ClientConfig))();
    const clientInitialStateMarshaller = new (MarshalFrom(ClientInitialState))();

    const internalWebFetcher: WebFetcher = new InternalWebFetcher();
    const identityClient: IdentityClient = newIdentityClient(
        config.ENV, config.ORIGIN, config.IDENTITY_SERVICE_HOST, internalWebFetcher);
    const contentPublicClient: ContentPublicClient = newContentPublicClient(
        config.ENV, config.ORIGIN, config.CONTENT_SERVICE_HOST, internalWebFetcher);

    const bundles: Bundles = isLocal(config.ENV)
        ? new WebpackDevBundles(theWebpackDevMiddleware(webpack(webpackConfig), {
            //Different because we're mounting on /real/client to boot webpackConfig.output.publicPath,
            publicPath: '/',
            serverSideRender: false
        }))
        : new CompiledBundles();

    const namespace = createNamespace(config.CLS_NAMESPACE_NAME);

    console.log('Starting up');

    function serverSideRender(url: string, subDomain: string, session: Session, clientInitialState: ClientInitialState): [string, number | null] {
        const language = inferLanguage(session);
        const store = createStoreFromInitialState(reducers, clientInitialState);

        const clientConfig = {
            env: config.ENV,
            origin: config.ORIGIN,
            originWithSubDomain: config.ORIGIN_WITH_SUBDOMAIN(subDomain),
            subDomain: subDomain,
            contentServiceHost: config.CONTENT_SERVICE_HOST,
            googleMapsApiKey: config.GOOGLE_MAPS_API_KEY,
            rollbarClientToken: config.ROLLBAR_CLIENT_TOKEN,
            session: session,
            language: language
        };

        namespace.set('SESSION', session);
        namespace.set('LANG', language);

        const staticContext: any = {};
        const appHtml = ReactDOMServer.renderToString(
            <Provider store={store}>
                <StaticRouter location={url} context={staticContext}>
                    <AppFrame />
                </StaticRouter>
            </Provider>
        );

        const specialStatus = staticContext.status == HttpStatus.NOT_FOUND ? HttpStatus.NOT_FOUND : null;

        const helmetData = Helmet.renderStatic();

        return [Mustache.render(bundles.getHtmlIndexTemplate(), {
            PAGE_TITLE_HTML: helmetData.title,
            PAGE_META_HTML: helmetData.meta,
            PAGE_LINK_HTML: helmetData.link,
            APP_HTML: appHtml,
            CLIENT_CONFIG: serializeJavascript(clientConfigMarshaller.pack(clientConfig), { isJSON: true }),
            CLIENT_INITIAL_STATE: serializeJavascript(clientInitialStateMarshaller.pack(clientInitialState), { isJSON: true }),
            WEBPACK_MANIFEST_JS: bundles.getManifestJs(),
        }), specialStatus];
    }

    console.log('Starting web server');

    const app = express();

    // Setup global properties and behaviours of the application
    // ********************

    app.disable('x-powered-by');
    app.use(newNamespaceMiddleware(namespace))
    app.set('subdomain offset', config.ORIGIN.split('.').length);
    if (isLocal(config.ENV)) {
        app.use(newLocalCommonServerMiddleware(config.NAME, config.ENV, false));
    } else {
        app.use(newCommonServerMiddleware(
            config.NAME,
            config.ENV,
            config.LOGGLY_TOKEN as string,
            config.LOGGLY_SUBDOMAIN as string,
            config.ROLLBAR_SERVER_TOKEN as string));
    }
    app.use(compression({ threshold: 0 }));

    // Setup the /real portion of the path-space. Here are things which don't belong to the client-side
    // interaction, but rather to the server-side one, callbacks from other services etc.
    // ********************

    // An API gateway for the client side code. Needs session to exist in the request.
    app.use('/real/api-gateway', newApiGatewayRouter(config.ORIGIN, internalWebFetcher));

    // Static serving of the client side code assets (index.html, vendor.js etc). No session. Derived
    // from the bundles.
    app.use('/real/client', bundles.getOtherBundlesRouter());

    // Setup serving of a bunch of files for interacting with the web at large, such as robots.txt,
    // sitemaps etc. These are derived from the bundles, with some extra data baked in. No session.
    // ********************

    const siteInfoRouter = express.Router();

    siteInfoRouter.get('/robots.txt', (_req: Request, res: express.Response) => {
        res.status(HttpStatus.OK);
        res.type('.txt');
        res.write(Mustache.render(bundles.getRobotsTxt(), { HOME_URI: config.ORIGIN }));
        res.end();
    });

    siteInfoRouter.get('/humans.txt', (_req: Request, res: express.Response) => {
        res.status(HttpStatus.OK);
        res.type('.txt');
        res.write(bundles.getHumansTxt());
        res.end();
    });

    siteInfoRouter.get('/sitemap.xml', (_req: Request, res: express.Response) => {
        res.status(HttpStatus.OK);
        res.type('application/xml; charset=utf-8');
        res.write(Mustache.render(bundles.getSitemapXml(), {
            HOME_URI: config.ORIGIN,
            HOME_LAST_MOD: new Date().toISOString()
        }));
        res.end();
    });

    app.use('/', siteInfoRouter);

    // Setup serving for all all client application level routes. Any path a user enters, which
    // doesn't match the ones from above (so /real ones or standard web ones) will be handled
    // by serving the "client application". This translated to doing a server-side render of the
    // application and serving that embedded into {@link src/shared/static/index.html}, which
    // will reference /real/client/client.js and other static resources in order to boot it up.
    // ********************

    const appRouter = express.Router();

    appRouter.use(newSessionMiddleware(SessionLevel.None, SessionInfoSource.Cookie, config.ENV, identityClient));
    appRouter.get('*', wrap(async (req: RequestWithIdentity, res: express.Response) => {
        if (req.subdomains.length != 1) {
            // Something's going on.
            throw new Error('Nothing to see here');
        }

        const subDomain = req.subdomains[0];
        let eventIsMissing: boolean = false;
        let event: Event | null = null;

        try {
            event = await contentPublicClient.withContext(req.sessionToken).getEventBySubDomain(subDomain);
        } catch (e) {
            if (e.name == 'EventNotFoundError') {
                eventIsMissing = true;
            } else {
                // Nothing happens here. We'll try again on the client. But we do log the error.
                req.log.warn(e);
                req.errorLog.warn(e);
            }
        }

        const initialState: ClientInitialState = {
            eventIsMissing: eventIsMissing,
            event: event
        };

        const [content, specialStatus] = serverSideRender(
            req.url,
            subDomain,
            req.session,
            initialState
        );

        res.status(specialStatus != null ? specialStatus : HttpStatus.OK);
        res.type('html');
        res.write(content);
        res.end();
    }));

    app.use('/', appRouter);

    // Start serving
    // ********************

    app.listen(config.PORT, config.ADDRESS, () => {
        console.log(`Started ${config.NAME} service on ${config.ADDRESS}:${config.PORT}`);
    });
}


main();
