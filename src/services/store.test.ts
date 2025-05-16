import { test, expect } from '@jest/globals';
import { rootReducer } from './store';
import { ingredientsReducer } from './ingredientsSlice';
import { burgerConstructorReducer } from './constructorSlice';
import { ordersReducer } from './ordersSlice';
import { userReducer } from './userSlice';

describe('Проверка rootReducer', () => {
    test('[#1] Проверка начального состояния хранилища', () => {
        const expectedResult = {
            ingredients: ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
            burgerConstructor: burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' }),
            orders: ordersReducer(undefined, { type: 'UNKNOWN_ACTION' }),
            user: userReducer(undefined, { type: 'UNKNOWN_ACTION' })
        };        
        const rootState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
        expect(rootState).toEqual(expectedResult);
    });
});