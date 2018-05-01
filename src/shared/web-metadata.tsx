import * as React from 'react'
import { Helmet } from 'react-helmet'

import { PictureSet } from '@truesparrow/content-sdk-js';

import * as config from './config'

import * as commonText from './common.text'



interface FacebookOpenGraphProps {
    host: string;
    realLink: string;
    title: string;
    pictureSet: PictureSet;
}

export function FacebookOpenGraph(props: FacebookOpenGraphProps) {
    return (
        <Helmet>
            <meta property="og:type" content="website" />
            <meta property="og:url" content={props.realLink} />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.title} />
            <meta property="og:site_name" content={commonText.siteName[config.LANG()]} />
            <meta property="og:image" content={props.pictureSet.pictures[0].mainImage.uri} />
            <meta property="og:image:alt" content={props.title} />
            <meta property="fb:app_id" content={config.FACEBOOK_APP_ID} />
        </Helmet>
    );
}

interface TwitterCardProps {
    host: string;
    title: string;
    pictureSet: PictureSet;
}

export function TwitterCard(props: TwitterCardProps) {
    return (
        <Helmet>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" content={props.title} />
            <meta name="twitter:creator" content={`${config.SEO_TWITTER_HANDLE}`} />
            <meta name="twitter:site" content={`${config.SEO_TWITTER_HANDLE}`} />
            <meta name="twitter:image" content={props.pictureSet.pictures[0].mainImage.uri} />
        </Helmet>
    );
}

interface MicrodataBreadcrumnsProps {
    items: { url: string, name: string }[]
}

export function MicrodataBreadcrumbs(props: MicrodataBreadcrumnsProps) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'http://schema.org',
                    '@type': 'BreadcrumbList',
                    'itemListElement': props.items.map((item, index) => {
                        return {
                            '@type': 'ListItem',
                            'position': index + 1,
                            'item': {
                                '@id': item.url,
                                'name': item.name
                            }
                        }
                    })
                })}
            </script>
        </Helmet>
    );
}

interface MicrodataEventProps {
    name: string;
    description: string;
    startDate: Date;
    locationName: string;
    pictureSet: PictureSet;
}

export function MicrodataEvent(props: MicrodataEventProps) {
    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify({
                    '@context': 'http://schema.org',
                    '@type': 'Event',
                    'name': props.name,
                    'description': props.description,
                    'startDate': props.startDate.toISOString(),
                    'location': {
                        '@type': 'Place',
                        'name': props.locationName
                    },
                    'image': props.pictureSet.pictures.map(p => p.mainImage.uri)
                })}
            </script>
        </Helmet>
    );
}
