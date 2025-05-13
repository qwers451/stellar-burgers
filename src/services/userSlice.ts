import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TRegisterData,
  TAuthResponse,
  TUserResponse,
  TLoginData,
  TServerResponse
} from '../utils/burger-api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

interface UserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  passwordResetRequested: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
  isAuthenticated: false,
  passwordResetRequested: false
};

export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при регистрации');
    }
  }
);

export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка при входе');
    }
  }
);

export const fetchUser = createAsyncThunk<TUserResponse>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка получения данных пользователя'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(fetchUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const updateUser = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>
>('user/update', async (data: Partial<TRegisterData>, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    return response;
  } catch (error: any) {
    return rejectWithValue(
      error.message || 'Ошибка обновления данных пользователя'
    );
  }
});

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка выхода из аккаунта');
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  'user/reset-password',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка смены пароля');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked(state) {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.isLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.isLoading = false;
        setCookie('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state, action) => ({
        ...initialState,
        isAuthChecked: true
      }))
      .addCase(resetPasswordUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  }
});

export const userReducer = userSlice.reducer;
export const { authChecked } = userSlice.actions;
