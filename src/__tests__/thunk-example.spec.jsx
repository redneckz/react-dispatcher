import React from 'react';
import thunk from 'redux-thunk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { applyMiddleware } from '../apply-middleware';
import { createDispatcher } from '../create-dispatcher';

describe('Thunk example', () => {
  let useDispatcher;

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    useDispatcher = applyMiddleware(thunk)(createDispatcher());
  });

  const dataReducer = (state, { type, payload }) => {
    switch (type) {
      case 'LOADING': return { ...state, params: payload, loading: true };
      case 'DATA': return { ...state, data: payload, loading: false };
      default: return state;
    }
  };

  const DATA = [{ id: 123 }, { id: 456 }, { id: 789 }];

  function fetchData(params) {
    return (dispatch) => { // Thunk
      setTimeout(() => dispatch({ type: 'LOADING', payload: params }), 100);
      setTimeout(() => dispatch({ type: 'DATA', payload: DATA }), 1000);
    };
  }

  function DataTable() {
    const [state = {}, dispatch] = React.useReducer(dataReducer);
    const { params, data, loading } = state;
    const dispatcher = useDispatcher(state, dispatch);

    React.useEffect(() => {
      dispatcher(fetchData('something'));
    }, [dispatcher]);

    if (loading) return `Loading ${params}...`;
    if (data && data.length) {
      return <ol>{data.map(({ id }) => <li key={id}>{id}</li>)}</ol>;
    }
    return 'No data';
  }

  test('Initial state (no data)', () => {
    const wrapper = mount(<DataTable />);
    expect(wrapper.text()).toBe('No data');
  });

  describe('Async fetchData thunk action creator', () => {
    test('Data loading phase', () => {
      const wrapper = mount(<DataTable />);
      act(() => {
        jest.advanceTimersByTime(100);
      });
      wrapper.update();
      expect(wrapper.text()).toBe('Loading something...');
    });
    test('Data fetch phase', () => {
      const wrapper = mount(<DataTable />);
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      wrapper.update();
      expect(
        wrapper.find('li').map((node) => node.text()),
      ).toEqual(['123', '456', '789']);
    });
  });
});
