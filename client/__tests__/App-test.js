import 'react-native';
import React from 'react';
import './_includes/store-mock';
import App from '../AppRedux';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
    renderer.create(<App />);
});
