import { expect } from 'chai'
import * as Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import 'mocha'

import { PostPage } from './post'

Enzyme.configure({adapter: new Adapter()});


describe('PostPage', () => {
    it('should render', () => {
        const wrapper = shallow(<PostPage />);
        expect(wrapper.contains('A post page')).to.be.true;
    });
});
