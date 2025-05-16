import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

interface IConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

export interface burgerConstructorState {
  constructorItems: IConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

export const initialState: burgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: state.constructorItems.ingredients.length.toString()
        });
      }
    },
    moveItemUp(state, action: PayloadAction<TConstructorIngredient>) {
      const index = parseInt(action.payload.id, 10);
      const temp = state.constructorItems.ingredients[index - 1];
      state.constructorItems.ingredients[index - 1] = {
        ...action.payload,
        id: (index - 1).toString()
      };
      state.constructorItems.ingredients[index] = {
        ...temp,
        id: index.toString()
      };
    },
    moveItemDown(state, action: PayloadAction<TConstructorIngredient>) {
      const index = parseInt(action.payload.id, 10);
      const temp = state.constructorItems.ingredients[index + 1];
      state.constructorItems.ingredients[index + 1] = {
        ...action.payload,
        id: (index + 1).toString()
      };
      state.constructorItems.ingredients[index] = {
        ...temp,
        id: index.toString()
      };
    },
    deleteItem(state, action: PayloadAction<TConstructorIngredient>) {
      const index = parseInt(action.payload.id, 10);
      state.constructorItems.ingredients.splice(index, 1);
      for (let i = index; i < state.constructorItems.ingredients.length; i++) {
        state.constructorItems.ingredients[i].id = (
          parseInt(state.constructorItems.ingredients[i].id, 10) - 1
        ).toString();
      }
    },
    reset() {
      return initialState;
    }
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;
export const { addItem, moveItemUp, moveItemDown, deleteItem, reset } =
  burgerConstructorSlice.actions;
