import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './ingredientsSlice';
import { burgerConstructorReducer } from './constructorSlice';
import { ordersReducer } from './ordersSlice';
import { userReducer } from './userSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  orders: ordersReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Selectors ingredients
export const selectIngredients = (state: RootState) =>
  state.ingredients.entities;
export const selectIsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectBunIngredients = (state: RootState) =>
  state.ingredients.entities.filter((item) => item.type === 'bun');
export const selectSauceIngredients = (state: RootState) =>
  state.ingredients.entities.filter((item) => item.type === 'sauce');
export const selectMainIngredients = (state: RootState) =>
  state.ingredients.entities.filter((item) => item.type === 'main');
export const selectIngredient = (id: string) => (state: RootState) =>
  state.ingredients.entities.find((item) => item._id === id);

// Selectors burgerConstuctor
export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

// Selectors orders
export const selectOrdersAll = (state: RootState) => state.orders.orders;
export const selectFeed = (state: RootState) => ({
  total: state.orders.total,
  totalToday: state.orders.totalToday
});
export const selectOrder = (number: string) => (state: RootState) =>
  state.orders.orders.find((order) => order.number.toString() === number);
export const selectOrderInfo = (state: RootState) => ({
  orderRequest: state.orders.orderRequest,
  orderModalData: state.orders.orderModalData
});
export const selectOrdersProfile = (state: RootState) =>
  state.orders.ordersProfile;

// Selectors user
export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export default store;
