import {
  getFeedsApi,
  getOrdersApi,
  orderBurgerApi,
  TNewOrderResponse
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export const fetchOrdersAll = createAsyncThunk('orders/fetchAll', async () => {
  const data = await getFeedsApi();
  return data;
});

export const orderBurger = createAsyncThunk<TNewOrderResponse, string[]>(
  'orders/order-burger',
  async (data: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при оформлении заказа');
    }
  }
);

export const ordersBurgerProfile = createAsyncThunk<TOrder[]>(
  'orders/profile-orders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка при получении заказов профиля'
      );
    }
  }
);

const initialState: TOrdersData & {
  ordersProfile: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  name: string | null;
} = {
  orders: [],
  ordersProfile: [],
  total: 0,
  totalToday: 0,
  orderRequest: false,
  orderModalData: null,
  name: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrder(state) {
      state.orderRequest = false;
      state.name = null;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAll.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.name = null;
        state.orderModalData = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.name = action.payload.name;
        state.orderModalData = action.payload.order;
      })
      .addCase(ordersBurgerProfile.fulfilled, (state, action) => {
        state.ordersProfile = action.payload;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
export const { resetOrder } = ordersSlice.actions;
