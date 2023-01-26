'use strict';

import renderer from 'react-test-renderer';
import Home from '../src/pages/login';
import { Provider } from 'react-redux'
import { store } from '../src/app/store'

// モック用に追記
jest.mock('next/router', () => ({
    useRouter() {
      return {
        asPath: '/',
      };
    },
  }));

describe('next-router-mock', () => {
    it('renders loginPages', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <Home></Home>
                </Provider>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    })
});
