import { test, expect } from '@jest/globals';
import { rootReducer } from './store';
import { ingredientsInitialState } from './ingredientsSlice';
import { initialState as constructorInitialState } from './constructorSlice';
import { ordersInitialState } from './ordersSlice';
import { userInitialState } from './userSlice';

describe('Проверка rootReducer', () => {
  test('[#1] Проверка начального состояния хранилища', () => {
    const expectedState = {
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      orders: ordersInitialState,
      user: userInitialState
    };

    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(actualState).toEqual(expectedState);
  });
});
