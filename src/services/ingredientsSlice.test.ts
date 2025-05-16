import { getIngredientsApi } from '@api';
import { test, jest, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

let mockStore = configureStore({
  reducer: ingredientsReducer
});

const ingredients: TIngredient[] = [
  {
      "_id": "643d69a5c3f7b9001cfa0941",
      "name": "Биокотлета из марсианской Магнолии",
      "type": "main",
      "proteins": 420,
      "fat": 142,
      "carbohydrates": 242,
      "calories": 4242,
      "price": 424,
      "image": "https://code.s3.yandex.net/react/code/meat-01.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/meat-01-large.png",
    },
    {
      "_id": "643d69a5c3f7b9001cfa093e",
      "name": "Филе Люминесцентного тетраодонтимформа",
      "type": "main",
      "proteins": 44,
      "fat": 26,
      "carbohydrates": 85,
      "calories": 643,
      "price": 988,
      "image": "https://code.s3.yandex.net/react/code/meat-03.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/meat-03-large.png",
    }
];

beforeEach(() => {
  mockStore = configureStore({
    reducer: ingredientsReducer
  });
});

describe('Проверка экшенов ingredientsReducer, генерируемых при выполнении асинхронного запроса', () => {

  describe('[fetchIngredients] Получение доступных ингредиентов', () => {

    test('[#1] Проверка состояния pending', () => {
      (getIngredientsApi as jest.Mock)
        .mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(fetchIngredients());
      const state = mockStore.getState();

      expect(state.isLoading).toBe(true);
    });

    test('[#2] Проверка состояния rejected', async () => {
      (getIngredientsApi as jest.Mock)
        .mockImplementation(() => Promise.reject());
      await mockStore.dispatch(fetchIngredients());
      const state = mockStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.isInit).toBe(true);
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      (getIngredientsApi as jest.Mock)
        .mockImplementation(() => Promise.resolve(ingredients));
      await mockStore.dispatch(fetchIngredients());
      const state = mockStore.getState();
      
      expect(state.isLoading).toBe(false);
      expect(state.isInit).toBe(true);
      expect(state.entities).toEqual(ingredients);
    });

  });

});