import mockConfigureStore from 'redux-mock-store';
import mockState from '../../reducers/init-state';

jest.mock('@reduxjs/toolkit', () => ({
    __esModule: true,
    configureStore: config => {
        const mockStore = mockConfigureStore(config?.middleware ?? []);
        return mockStore(mockState);
    },
}));