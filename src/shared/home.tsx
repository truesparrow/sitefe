import * as React from 'react'

import * as config from './config'

import * as text from './home.text'


export const HomePage = () => <div>{text.homePage[config.LANG()]}</div>;
