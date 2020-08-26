import React from 'react';
 
// TODO, connect this to the project in jest.config.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
 
configure({ adapter: new Adapter() });