import { test, expect } from '@jest/globals';
import { addItem, burgerConstructorReducer, burgerConstructorState, deleteItem, initialState, moveItemDown, moveItemUp } from './constructorSlice';
import { configureStore } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

describe('Проверка burgerConstructorReducer', () => {

    const mockBun: TIngredient = {
        _id: 'test_id-1',
        name: 'Булка',
        type: 'bun',
        proteins: 10,
        fat: 0,
        carbohydrates: 50,
        calories: 150,
        price: 100,
        image: 'testimage.png',
        image_large: 'testimage-large.png',
        image_mobile: 'testimage-mobile.png'
    };
    
    const mockBun2: TIngredient = {
        _id: 'test_id-2',
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
    };
    
    const mockIngr1: TIngredient = {
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
    };
    
    const mockIngr2: TIngredient = {
        _id: 'test_id-4',
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
    };

    const initialState: burgerConstructorState = {
        constructorItems: {
            bun: mockBun,
            ingredients: [
                { ...mockIngr1, id: '0' }, 
                { ...mockIngr2, id: '1' }
            ]
        },
        orderRequest: false,
        orderModalData: null
    }

    describe('[addItem] action добавления ингредиента', () => {
    
        test('[#1] Проверка добавления булки', () => {
            const store = configureStore({ reducer: burgerConstructorReducer });
            store.dispatch(addItem(mockBun));
            const currentState = store.getState();
            expect(currentState.constructorItems.bun).toEqual(mockBun);
            expect(currentState.constructorItems.ingredients.length).toBe(0);
        });

        test('[#2] Проверка добавления 2 ингредиентов', () => {
            const store = configureStore({ reducer: burgerConstructorReducer });
            store.dispatch(addItem(mockIngr1));
            let currentState = store.getState();
            expect(currentState.constructorItems.ingredients.length).toBe(1);
            expect(currentState.constructorItems.ingredients[0]).toMatchObject(
                { ...mockIngr1, id: '0' }
            );
            store.dispatch(addItem(mockIngr2));
            currentState = store.getState();
            expect(currentState.constructorItems.ingredients.length).toBe(2);
            expect(currentState.constructorItems.ingredients[0]).toMatchObject(
                { ...mockIngr1, id: '0' }
            );
            expect(currentState.constructorItems.ingredients[1]).toMatchObject(
                { ...mockIngr2, id: '1' }
            );
        });

        test('[#3] Проверка добавления ингредиентов и булки', () => {
            const store = configureStore({ reducer: burgerConstructorReducer });
            store.dispatch(addItem(mockIngr1));
            store.dispatch(addItem(mockBun));
            store.dispatch(addItem(mockIngr2));

            const currentState = store.getState();
            expect(currentState.constructorItems.ingredients.length).toBe(2);
            expect(currentState.constructorItems.ingredients[0]).toMatchObject(
                { ...mockIngr1, id: '0' }
            );
            expect(currentState.constructorItems.ingredients[1]).toMatchObject(
                { ...mockIngr2, id: '1' }
            );
            expect(currentState.constructorItems.bun).toEqual(mockBun);
        });

        test('[#4] Проверка добавления двух булок', () => {
            const store = configureStore({ reducer: burgerConstructorReducer });
            store.dispatch(addItem(mockBun));
            store.dispatch(addItem(mockBun2));
            const currentState = store.getState();
            expect(currentState.constructorItems.bun).toEqual(mockBun2);
        });

    });


    describe('[deleteItem] action удаления ингредиента', () => {

        test('[#1] удаление первого ингредиента', () => {
            const state = burgerConstructorReducer(
                initialState, deleteItem(initialState.constructorItems.ingredients[0])
            );

            expect(state.constructorItems.ingredients.length).toBe(1);
            expect(state.constructorItems.ingredients[0]).toMatchObject(
                { ...initialState.constructorItems.ingredients[1], id: '0' }
            );
        });

        test('[#2] удаление всех ингредиентов', () => {
            let state = initialState;

            initialState.constructorItems.ingredients.forEach((item) => {
                state = burgerConstructorReducer(
                    state, deleteItem({ ...item, id: '0' })
                );
            });

            expect(state.constructorItems.ingredients.length).toBe(0);
        });

        test('[#3] удаление второго ингредиента', () => {
            const state = burgerConstructorReducer(
                initialState, deleteItem(initialState.constructorItems.ingredients[1])
            );
            expect(state.constructorItems.ingredients.length).toBe(1);
            expect(state.constructorItems.ingredients[0]).toMatchObject(
                initialState.constructorItems.ingredients[0]
            );
        });
    });

    describe('[moveItem] actions перемещение ингредиентов', () => {

        describe('[moveItemUp] action перемещение ингредиента вверх', () => {
            
            test('[#1] перемещение ингредиента вверх', () => {
                const state = burgerConstructorReducer(
                    initialState, moveItemUp(initialState.constructorItems.ingredients[1])
                );
                expect(state.constructorItems.ingredients[0]).toMatchObject(
                    { ...initialState.constructorItems.ingredients[1], id: '0' }
                );
                expect(state.constructorItems.ingredients[1]).toMatchObject(
                    { ...initialState.constructorItems.ingredients[0], id: '1' }
                );
                expect(state.constructorItems.ingredients.length).toBe(2);
            });

        });

        describe('[moveItemDown] action перемещение ингредиента вниз', () => {

            test('[#1] перемещение ингредиента вниз', () => {
                const state = burgerConstructorReducer(
                    initialState, moveItemDown(initialState.constructorItems.ingredients[0])
                );
                expect(state.constructorItems.ingredients[1]).toMatchObject(
                    { ...initialState.constructorItems.ingredients[0], id: '1' }
                );
                expect(state.constructorItems.ingredients[0]).toMatchObject(
                    { ...initialState.constructorItems.ingredients[1], id: '0' }
                );
                expect(state.constructorItems.ingredients.length).toBe(2);
            });

        });

        test('[#1] перемещение ингредиента вниз и вверх', () => {
            let state = burgerConstructorReducer(
                initialState, moveItemDown(initialState.constructorItems.ingredients[0])
            );
            state = burgerConstructorReducer(
                state, moveItemUp(state.constructorItems.ingredients[1])
            );
            expect(state.constructorItems.ingredients[1]).toMatchObject(
                { ...initialState.constructorItems.ingredients[1], id: '1' }
            );
            expect(state.constructorItems.ingredients[0]).toMatchObject(
                { ...initialState.constructorItems.ingredients[0], id: '0' }
            );
            expect(state.constructorItems.ingredients.length).toBe(2);
        });

    });
});