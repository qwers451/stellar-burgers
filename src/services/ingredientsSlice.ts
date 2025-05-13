import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

interface ingredientsState {
  isLoading: boolean;
  isInit: boolean;
  entities: TIngredient[];
}

const initialState: ingredientsState = {
  isLoading: false,
  isInit: false,
  entities: []
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.isInit = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.isLoading = false;
        state.isInit = true;
      });
  }
});

export const ingredientsAction = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
