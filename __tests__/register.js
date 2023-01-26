'use strict';

import renderer from 'react-test-renderer';
import LoginScreen from '../src/pages/register';
import { Provider } from 'react-redux'
import { store } from '../src/app/store'

// モック用に追記
jest.mock('next/router', () => ({
    useRouter() {
      return {
        asPath: '/registerComp',
      };
    },
  }));

describe('next-router-mock', () => {
    it('renders loginPages', () => {
        const tree = renderer
            .create(
                <Provider store={store}>
                    <LoginScreen></LoginScreen>
                </Provider>
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    })
});
