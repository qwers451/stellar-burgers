import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';

interface IConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface BurgerConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: BurgerConstructorState = {
  constructorItems: {
    ingredients: [],
    bun: null
  },
  orderModalData: null,
  orderRequest: false
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients = [
          ...state.constructorItems.ingredients,
          {
            ...action.payload,
            id: state.constructorItems.ingredients.length.toString()
          }
        ];
      }
    },
    moveItemUp(state, action: PayloadAction<TConstructorIngredient>) {
      const idx = parseInt(action.payload.id, 10);
      const prevItem = state.constructorItems.ingredients[idx - 1];
      state.constructorItems.ingredients[idx - 1] = {
        ...action.payload,
        id: (idx - 1).toString()
      };
      state.constructorItems.ingredients[idx] = {
        ...prevItem,
        id: idx.toString()
      };
    },
    moveItemDown(state, action: PayloadAction<TConstructorIngredient>) {
      const idx = parseInt(action.payload.id, 10);
      const nextItem = state.constructorItems.ingredients[idx + 1];
      state.constructorItems.ingredients[idx + 1] = {
        ...action.payload,
        id: (idx + 1).toString()
      };
      state.constructorItems.ingredients[idx] = {
        ...nextItem,
        id: idx.toString()
      };
    },
    deleteItem(state, action: PayloadAction<TConstructorIngredient>) {
      const idx = parseInt(action.payload.id, 10);
      state.constructorItems.ingredients = [
        ...state.constructorItems.ingredients.slice(0, idx),
        ...state.constructorItems.ingredients.slice(idx + 1).map(item => ({
          ...item,
          id: (parseInt(item.id, 10) - 1).toString()
        }))
      ];
    },
    reset: () => initialState
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const { addItem, moveItemUp, moveItemDown, deleteItem, reset } = burgerConstructorSlice.actions;
