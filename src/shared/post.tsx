import * as React from 'react'

import * as config from './config'

import * as text from './post.text'

export const PostPage = () => <div>{text.postPage[config.LANG()]}</div>;
