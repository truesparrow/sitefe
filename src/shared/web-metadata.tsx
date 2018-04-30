import * as React from 'react'
import { Helmet } from 'react-helmet'

import * as config from './config'

import * as commonText from './common.text'


interface FacebookOpenGraphProps {
    host: string;
    realLink: string;
    title: string;
    description: string;
}

export function FacebookOpenGraph(props: FacebookOpenGraphProps) {
    return (
        <Helmet>
            <meta property="og:url" content={props.realLink} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:site_name" content={commonText.siteName[config.LANG()]} />
            <meta property="og:image" content={`${props.host}real/client/home-page-hero.jpg`} />
            // <meta property="og:locale" content={config.LANG()} />
            <meta property="fb:app_id" content={config.FACEBOOK_APP_ID} />
        </Helmet>
    );
}

interface TwitterCardProps {
    host: string;
    title: string;
    description: string;
}

export function TwitterCard(props: TwitterCardProps) {
    return (
        <Helmet>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" content={props.description} />
            <meta name="twitter:creator" content={`${config.SEO_TWITTER_HANDLE}`} />
            <meta name="twitter:site" content={`${config.SEO_TWITTER_HANDLE}`} />
            <meta name="twitter:image" content={`${props.host}real/client/home-page-hero.jpg`} />
        </Helmet>
    );
}
