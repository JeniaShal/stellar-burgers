import { expect, test } from '@jest/globals';
import { rootReducer } from '../reducers/root-reducer';
import { store } from '../store';

describe('проверим правильность настройки и работы root-reducer_а', () => {
  const testState = rootReducer(undefined, { type: '' });

  test('проверим, что возвращает состояние по умолчанию', () => {
    expect(testState).toEqual(store.getState());
  });
});
