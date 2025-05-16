import { test, jest, expect } from '@jest/globals';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { configureStore } from '@reduxjs/toolkit';
import {
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPasswordUser,
  updateUser,
  userReducer,
  UserState
} from './userSlice';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';

jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  resetPasswordApi: jest.fn()
}));

jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}))

let mockStore = configureStore({
  reducer: userReducer
});

beforeEach(() => {
  mockStore = configureStore({ reducer: userReducer });
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Проверка экшенов userSlice, генерируемых при выполнении асинхронного запроса', () => {

  describe('[fetchUser] Получение данных пользователя по токену', () => {

    test('[#1] Проверка состояния pending', () => {
      (getUserApi as jest.Mock)
          .mockImplementation(() => new Promise(() => {}));

      mockStore.dispatch(fetchUser());
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('[#2] Проверка состояния rejected', async () => {
      const errorMessage = 'Ошибка при получении пользователя';
      (getUserApi as jest.Mock)
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));
      await mockStore.dispatch(fetchUser());
      const state = mockStore.getState();

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      const user: TUser = {
          name: 'Alex',
          email: 'alex@gmail.com'
      };
      (getUserApi as jest.Mock)
        .mockImplementation(() => Promise.resolve({
          success: true,
          user: user
        }));

      await mockStore.dispatch(fetchUser());
      const state = mockStore.getState();

      expect(state.user).toEqual(user);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBeNull();
    });

  });

  describe('[updateUser] Проверка обновления данных пользователя', () => {

    test('[#1] Проверка состояния pending', () => {
      (updateUserApi as jest.Mock).mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(updateUser({}));
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('[#2] Проверка состояния rejected', async () => {
      const errorMessage = 'Ошибка при обновлении данных пользователя';
      (updateUserApi as jest.Mock).mockImplementation(() => Promise.reject(new Error(errorMessage)));
      await mockStore.dispatch(updateUser({}))
      const state = mockStore.getState();

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      const newData: Partial<TRegisterData> = {
        email: 'newmail@mail.ru',
        name: 'John',
        password: '123456'
      };
      (updateUserApi as jest.Mock).mockImplementation(() => Promise.resolve({
        success: true,
        user: {
          email: newData.email,
          name: newData.name
        }
      }));
      await mockStore.dispatch(updateUser(newData));
      const state = mockStore.getState();

      expect(state.user).toEqual({
        email: newData.email,
        name: newData.name
      });
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);

    });

  });

  describe('[registerUser] Проверка регистрации пользователя', () => {

    const newUserData: TRegisterData = {
      email: 'test@gmail.com',
      name: 'Test',
      password: '123456'
    };

    test('[#1] Проверка состояния pending', () => {
      (registerUserApi as jest.Mock)
        .mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(registerUser(newUserData));
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('[#2] Проверка состояния rejected', async () => {
      const errorMessage = 'Ошибка при регистрации пользователя';
      (registerUserApi as jest.Mock)
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));
      await mockStore.dispatch(registerUser(newUserData));
      const state = mockStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      const user: TUser = {
        email: newUserData.email,
        name: newUserData.name
      }
      const response: TAuthResponse = {
        success: true,
        refreshToken: 'fake-refresh-token',
        accessToken: 'fake-access-token',
        user: user
      };
      (registerUserApi as jest.Mock)
        .mockImplementation(() => Promise.resolve(response));
      await mockStore.dispatch(registerUser(newUserData));
      const state = mockStore.getState();

      expect(state.error).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(user);
      expect(setCookie).toHaveBeenCalledWith('accessToken', response.accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(response.refreshToken);
    });

  });

  describe('[loginUser] Проверка авторизации пользователя', () => {

    const loginData: TLoginData = {
      email: 'test@gmail.com',
      password: '123456'
    };

    test('[#1] Проверка состояния pending', () => {
      (loginUserApi as jest.Mock)
        .mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(loginUser(loginData));
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('[#2] Проверка состояния rejected', async () => {
      const errorMessage = 'Ошибка при входе в аккаунт';
      (loginUserApi as jest.Mock)
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));
      await mockStore.dispatch(loginUser(loginData));
      const state = mockStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuthChecked).toBe(true);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      const user: TUser = {
        email: 'test@gmail.com',
        name: 'Test'
      }
      const response: TAuthResponse = {
        success: true,
        refreshToken: 'fake-refresh-token',
        accessToken: 'fake-access-token',
        user: user
      };
      (loginUserApi as jest.Mock)
        .mockImplementation(() => Promise.resolve(response));
      await mockStore.dispatch(loginUser(loginData));
      const state = mockStore.getState();

      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(user);
      expect(setCookie).toHaveBeenCalledWith('accessToken', response.accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(response.refreshToken);
    });

  });

  describe('[logoutUser] Проверка выхода из аккаунта', () => {

    const preloadedState: UserState = {
      user: {
        name: 'Test',
        email: 'test@gmail.com'
      },
      isLoading: false,
      error: null,
      isAuthChecked: true,
      isAuthenticated: true,
      passwordResetRequested: false
    };
    
    beforeEach(() => {
      mockStore = configureStore({
        reducer: userReducer,
        preloadedState
      });
    });

    test('[#1] Проверка состояния pending', () => {
      (logoutApi as jest.Mock)
        .mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(logoutUser());
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
    });

    test('[#2] Проверка состояния rejected', async () => {
      const errorMessage = 'Ошибка при выходе из аккаунта';
      (logoutApi as jest.Mock)
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));
      await mockStore.dispatch(logoutUser());
      const state = mockStore.getState();

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      (logoutApi as jest.Mock)
        .mockImplementation(() => Promise.resolve());
      await mockStore.dispatch(logoutUser());
      const state = mockStore.getState();

      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(deleteCookie).toHaveBeenCalledWith('accessToken');
      expect(localStorage.getItem('refreshToken')).toBeUndefined;
    });

  });

  describe('[resetPasswordUser] Восстановление пароля аккаунта', () => {

    const data = {
      password: '333222',
      token: 'fake-access-token'
    }

    test('[#1] Проверка состояния pending', () => {
      (resetPasswordApi as jest.Mock)
        .mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(resetPasswordUser(data));
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('[#2] Проверка состояния rejected', async () => {
      const errorMessage = 'Ошибка при восстановлении пароля';
      (resetPasswordApi as jest.Mock)
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));
      await mockStore.dispatch(resetPasswordUser(data));
      const state = mockStore.getState();

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      (resetPasswordApi as jest.Mock)
        .mockImplementation(() => Promise.resolve());
      await mockStore.dispatch(resetPasswordUser(data));
      const state = mockStore.getState();

      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

  });

});