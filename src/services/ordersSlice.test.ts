import { getFeedsApi, getOrdersApi, orderBurgerApi, TNewOrderResponse } from '@api';
import { test, jest, expect } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { fetchOrdersAll, orderBurger, ordersBurgerProfile, ordersReducer } from './ordersSlice';
import { TIngredient } from '@utils-types';

jest.mock('@api', () => ({
    getFeedsApi: jest.fn(),
    orderBurgerApi: jest.fn(),
    getOrdersApi: jest.fn()
}));

let mockStore = configureStore({
  reducer: ordersReducer
});

const orders = {
  "success": true,
  "orders": [
    {
      "_id": "6817b7fbe8e61d001cec60a2",
      "ingredients": [
          "643d69a5c3f7b9001cfa093e"
      ],
      "status": "done",
      "name": "Люминесцентный бургер",
      "createdAt": "2025-05-04T18:54:51.182Z",
      "updatedAt": "2025-05-04T18:54:51.842Z",
      "number": 76234
    },
    {
      "_id": "6817b838e8e61d001cec60a3",
      "ingredients": [
          "643d69a5c3f7b9001cfa093e",
          "643d69a5c3f7b9001cfa093e",
          "643d69a5c3f7b9001cfa093e"
      ],
      "status": "done",
      "name": "Люминесцентный бургер",
      "createdAt": "2025-05-04T18:55:52.448Z",
      "updatedAt": "2025-05-04T18:55:53.145Z",
      "number": 76235
    }
  ],
  "total": 76263,
  "totalToday": 94
};

const ingredients: TIngredient[] = [
  {
    _id: 'test_id-1',
    name: 'Анти-Булка',
    type: 'bun',
    proteins: 10,
    fat: 0,
    carbohydrates: 50,
    calories: 150,
    price: 100,
    image: 'testimage.png',
    image_large: 'testimage-large.png',
    image_mobile: 'testimage-mobile.png'
  },
  {
    _id: 'test_id-2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 15,
    carbohydrates: 5,
    calories: 150,
    price: 110,
    image: 'testimage.png',
    image_large: 'testimage-large.png',
    image_mobile: 'testimage-mobile.png'
  },
  {
    _id: 'test_id-3',
    name: 'Салат',
    type: 'main',
    proteins: 0,
    fat: 0,
    carbohydrates: 50,
    calories: 50,
    price: 70,
    image: 'testimage.png',
    image_large: 'testimage-large.png',
    image_mobile: 'testimage-mobile.png'
  }
];

const profileOrders = {
    "success": true,
    "orders": [
        {
            "_id": "6817b7fbe8e61d001cec60a2",
            "ingredients": [
                "643d69a5c3f7b9001cfa093e"
            ],
            "status": "done",
            "name": "Люминесцентный бургер",
            "createdAt": "2025-05-04T18:54:51.182Z",
            "updatedAt": "2025-05-04T18:54:51.842Z",
            "number": 76234
        },
        {
            "_id": "6817b838e8e61d001cec60a3",
            "ingredients": [
                "643d69a5c3f7b9001cfa093e",
                "643d69a5c3f7b9001cfa093e",
                "643d69a5c3f7b9001cfa093e"
            ],
            "status": "done",
            "name": "Люминесцентный бургер",
            "createdAt": "2025-05-04T18:55:52.448Z",
            "updatedAt": "2025-05-04T18:55:53.145Z",
            "number": 76235
        },
        {
            "_id": "6817ca92e8e61d001cec6105",
            "ingredients": [
                "643d69a5c3f7b9001cfa093e",
                "643d69a5c3f7b9001cfa093e",
                "643d69a5c3f7b9001cfa093e"
            ],
            "status": "done",
            "name": "Люминесцентный бургер",
            "createdAt": "2025-05-04T20:14:10.865Z",
            "updatedAt": "2025-05-04T20:14:12.297Z",
            "number": 76259
        },
    ],
    "total": 76271,
    "totalToday": 83
};

beforeEach(() => {
  mockStore = configureStore({ reducer: ordersReducer });
  jest.clearAllMocks();
  localStorage.clear();
});

describe('Проверка экшенов ordersSlice, генерируемых при выполнении асинхронного запроса', () => {
  
  describe('[fetchOrdersAll] Получение списка всех заказов', () => {

    test('[#1] Проверка состояния fulfilled', async () => {
      (getFeedsApi as jest.Mock)
        .mockImplementation(() => Promise.resolve(orders));
      await mockStore.dispatch(fetchOrdersAll());
      const state = mockStore.getState();

      expect(state.orders).toEqual(orders.orders);
      expect(state.total).toBe(orders.total);
      expect(state.totalToday).toBe(orders.totalToday);
    });

  });

  describe('[orderBurger] Оформление заказа бургера', () => {

    const ids: string[] = [
      ingredients[0]._id, ingredients[1]._id, ingredients[2]._id, ingredients[0]._id
    ];

    test('[#1] Проверка состояния pending', () => {
      (orderBurgerApi as jest.Mock)
        .mockImplementation(() => new Promise(() => {}));
      mockStore.dispatch(orderBurger(ids));
      const state = mockStore.getState();

      expect(state.orderRequest).toBe(true);
    });

    test('[#2] Проверка состояния rejected', async () => {
      (orderBurgerApi as jest.Mock)
        .mockImplementation(() => Promise.reject());
      await mockStore.dispatch(orderBurger(ids));
      const state = mockStore.getState();

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.name).toBeNull();
    });

    test('[#3] Проверка состояния fulfilled', async () => {
      const response: TNewOrderResponse = {
        "success": true,
        "name": "Краторный био-марсианский люминесцентный бургер",
        "order": {
          "_id": "mockid-1",
          "status": "done",
          "name":"Краторный био-марсианский люминесцентный бургер",
          "createdAt": "2025-05-09T04:32:32.323Z",
          "updatedAt": "2025-05-09T04:32:33.201Z",
          "number": 12345,
          "ingredients": ids
        }
      };
      (orderBurgerApi as jest.Mock)
        .mockImplementation(() => Promise.resolve(response));
      await mockStore.dispatch(orderBurger(ids));
      const state = mockStore.getState();

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(response.order);
      expect(state.name).toBe(response.name);
    });

  });

  describe('[ordersBurgerProfile] Получение заказов пользователя', () => {
  
    test('[#1] Проверка состояния fulfilled', async () => {
      (getOrdersApi as jest.Mock)
        .mockImplementation(() => Promise.resolve(profileOrders.orders));
      await mockStore.dispatch(ordersBurgerProfile());
      const state = mockStore.getState();

      expect(state.ordersProfile).toEqual(profileOrders.orders);
    });

  });

});