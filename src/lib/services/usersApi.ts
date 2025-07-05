import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  lineId: string;
  name: string;
  birthday?: string;
  gender?: string;
  height?: string;
  chronicIllness?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  lineId: string;
  name: string;
  birthday?: string;
  gender?: string;
  height?: string;
  chronicIllness?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  birthday?: string;
  gender?: string;
  height?: string;
  chronicIllness?: string[];
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
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
  tagTypes: ['User'],
  endpoints: builder => ({
    // 獲取所有使用者
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),

    // 根據 lineId 獲取單一使用者
    getUserByLineId: builder.query<User, string>({
      query: lineId => `/users/${lineId}`,
      providesTags: (result, error, lineId) => [{ type: 'User', id: lineId }],
    }),

    // 建立新使用者
    createUser: builder.mutation<User, CreateUserRequest>({
      query: userData => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // 更新使用者
    updateUser: builder.mutation<
      User,
      { lineId: string; data: UpdateUserRequest }
    >({
      query: ({ lineId, data }) => ({
        url: `/users/${lineId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { lineId }) => [
        { type: 'User', id: lineId },
        'User',
      ],
    }),

    // 刪除使用者
    deleteUser: builder.mutation<void, string>({
      query: lineId => ({
        url: `/users/${lineId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByLineIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
