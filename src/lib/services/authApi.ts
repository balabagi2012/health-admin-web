import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface AuthResponse {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'doctor';
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'user' | 'admin' | 'doctor';
}

export interface UpdateProfileRequest {
  name?: string;
  role?: 'user' | 'admin' | 'doctor';
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  email: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE || '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token?: string } }).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    // 註冊
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: credentials => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 登入
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // 取得個人資料
    getProfile: builder.query<AuthResponse, string>({
      query: email => `/auth/profile?email=${email}`,
    }),

    // 更新個人資料
    updateProfile: builder.mutation<AuthResponse, UpdateProfileRequest>({
      query: profileData => ({
        url: '/auth/profile',
        method: 'PUT',
        body: profileData,
      }),
    }),

    // 變更密碼
    changePassword: builder.mutation<
      { message: string },
      ChangePasswordRequest
    >({
      query: passwordData => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
