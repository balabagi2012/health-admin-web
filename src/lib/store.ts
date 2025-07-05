import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './services/authApi';
import { usersApi } from './services/usersApi';
import { recordsApi } from './services/recordsApi';
import { lineApi } from './services/lineApi';
import { systemConfigsApi } from './services/systemConfigsApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [recordsApi.reducerPath]: recordsApi.reducer,
    [lineApi.reducerPath]: lineApi.reducer,
    [systemConfigsApi.reducerPath]: systemConfigsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      usersApi.middleware,
      recordsApi.middleware,
      lineApi.middleware,
      systemConfigsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
