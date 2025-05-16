import { test, expect } from '@jest/globals';
import { rootReducer } from './store';

const expectedInitialState = {
  ingredients: {
    isLoading: false,
    isInit: false,
    entities: []
  },
  burgerConstructor: {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null
  },
  orders: {
    orders: [],
    ordersProfile: [],
    total: 0,
    totalToday: 0,
    orderRequest: false,
    orderModalData: null,
    name: null
  },
  user: {
    user: null,
    isLoading: false,
    error: null,
    isAuthChecked: false,
    isAuthenticated: false,
    passwordResetRequested: false
  }
};

describe('Проверка rootReducer', () => {
  test('[#1] Проверка начального состояния хранилища', () => {
    const actualState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(actualState).toEqual(expectedInitialState);
  });

  test('[#2] Проверка обработки действия fetchIngredients.pending', () => {
    const action = { type: 'ingredients/fetchIngredients/pending' };
    const actualState = rootReducer(undefined, action);

    const expectedState = {
      ...expectedInitialState,
      ingredients: {
        ...expectedInitialState.ingredients,
        isLoading: true
      }
    };

    expect(actualState).toEqual(expectedState);
  });

  test('[#3] Проверка добавления булочки в burgerConstructor', () => {
    const bun = {
      _id: '123',
      name: 'Test Bun',
      type: 'bun',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 100,
      price: 200,
      image: 'image.jpg',
      image_mobile: 'image_mobile.jpg',
      image_large: 'image_large.jpg'
    };
    const action = { type: 'burgerConstructor/addItem', payload: bun };
    const actualState = rootReducer(undefined, action);

    const expectedState = {
      ...expectedInitialState,
      burgerConstructor: {
        ...expectedInitialState.burgerConstructor,
        constructorItems: {
          ...expectedInitialState.burgerConstructor.constructorItems,
          bun
        }
      }
    };

    expect(actualState).toEqual(expectedState);
  });

  test('[#4] Проверка обработки действия orderBurger.pending', () => {
    const action = { type: 'orders/order-burger/pending' };
    const actualState = rootReducer(undefined, action);

    const expectedState = {
      ...expectedInitialState,
      orders: {
        ...expectedInitialState.orders,
        orderRequest: true
      }
    };

    expect(actualState).toEqual(expectedState);
  });

  test('[#5] Проверка успешного логина пользователя', () => {
    const user = { name: 'Test User', email: 'test@example.com' };
    const accessToken = 'testAccessToken';
    const refreshToken = 'testRefreshToken';
    const action = {
      type: 'user/login/fulfilled',
      payload: { user, accessToken, refreshToken }
    };
    const actualState = rootReducer(undefined, action);

    const expectedState = {
      ...expectedInitialState,
      user: {
        ...expectedInitialState.user,
        user,
        isAuthChecked: true,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    };

    expect(actualState).toEqual(expectedState);
  });
});
