import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import * as config from './config'
import { HomePage } from './home-page'


Enzyme.configure({adapter: new Adapter()});

describe('HomePage', () => {
    before('set LANG', () => {
        (config as any).LANG = () => 'en'; // Not nice
    });

   it('should render', () => {
        const wrapper = mount(<HomePage />);
        expect(wrapper.contains('Home page')).to.be.true;
    });
});
