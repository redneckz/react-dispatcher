import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { createDispatcher } from '../create-dispatcher';

describe('Timer example', () => {
  let useDispatcher;

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    useDispatcher = createDispatcher();
  });

  const timerReducer = (state, { type, payload }) => {
    switch (type) {
      case 'RESET':
        return { count: payload || 0, en: false };
      case 'START':
        return { ...state, en: true };
      case 'STOP':
        return { ...state, en: false };
      case 'INC':
        return state.en ? { ...state, count: state.count + 1 } : state;
      default:
        return state;
    }
  };

  function Timer({ label, timeout = 1000 }) {
    const [state = {}, dispatch] = React.useReducer(timerReducer);
    const scopedDispatch = (action) => {
      if (action.meta.label === label) dispatch(action);
    };
    useDispatcher(
      state,
      React.useCallback(label ? scopedDispatch : dispatch, [dispatch, label]),
    );
    React.useEffect(() => {
      dispatch({ type: 'RESET' });
      const timerId = setInterval(() => dispatch({ type: 'INC' }), timeout);
      return () => clearInterval(timerId);
    }, [dispatch, timeout]);
    return <span>{state.count || 0}</span>;
  }

  function TimerControl({ label, type }) {
    const dispatcher = useDispatcher();
    const handleClick = React.useCallback(() => {
      dispatcher({ type, meta: { label } });
    }, [dispatcher, type, label]);
    return <button type="button" onClick={handleClick}>{type}</button>;
  }

  test('Initial state', () => {
    const wrapper = mount(<Timer timeout={1000} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(wrapper.find('Timer').text()).toBe('0');
  });

  test('Global start control', () => {
    const wrapper = mount(
      <>
        <Timer timeout={1000} />
        <Timer timeout={1000} />
        <TimerControl type="START" />
      </>,
    );
    act(() => {
      wrapper.find('TimerControl').simulate('click');
      jest.advanceTimersByTime(1000);
    });
    expect(timerText(wrapper)(0)).toBe('1');
    expect(timerText(wrapper)(1)).toBe('1');
  });

  test('Scoped start control', () => {
    const wrapper = mount(
      <>
        <Timer label="foo" />
        <TimerControl label="foo" type="START" />
        <Timer label="bar" />
      </>,
    );
    act(() => {
      wrapper.find('TimerControl').simulate('click');
      jest.advanceTimersByTime(1000);
    });
    expect(timerText(wrapper)(0)).toBe('1');
    expect(timerText(wrapper)(1)).toBe('0');
  });

  function timerText(wrapper) {
    return (i) => wrapper.find('Timer').at(i).text();
  }
});
