import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'json';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSystemConfigRequest {
  key: string;
  value: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'json';
  isActive?: boolean;
}

export interface UpdateSystemConfigRequest {
  value?: string;
  description?: string;
  type?: 'string' | 'number' | 'boolean' | 'json';
  isActive?: boolean;
}

export const systemConfigsApi = createApi({
  reducerPath: 'systemConfigsApi',
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
  tagTypes: ['SystemConfig'],
  endpoints: builder => ({
    // 獲取所有系統配置
    getSystemConfigs: builder.query<SystemConfig[], void>({
      query: () => '/system-configs',
      providesTags: ['SystemConfig'],
    }),

    // 根據 key 獲取系統配置
    getSystemConfigByKey: builder.query<SystemConfig, string>({
      query: key => `/system-configs/${key}`,
      providesTags: (result, error, key) => [{ type: 'SystemConfig', id: key }],
    }),

    // 建立新系統配置
    createSystemConfig: builder.mutation<
      SystemConfig,
      CreateSystemConfigRequest
    >({
      query: configData => ({
        url: '/system-configs',
        method: 'POST',
        body: configData,
      }),
      invalidatesTags: ['SystemConfig'],
    }),

    // 更新系統配置
    updateSystemConfig: builder.mutation<
      SystemConfig,
      { key: string; data: UpdateSystemConfigRequest }
    >({
      query: ({ key, data }) => ({
        url: `/system-configs/${key}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { key }) => [
        { type: 'SystemConfig', id: key },
        'SystemConfig',
      ],
    }),

    // 刪除系統配置
    deleteSystemConfig: builder.mutation<void, string>({
      query: key => ({
        url: `/system-configs/${key}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, key) => [
        { type: 'SystemConfig', id: key },
        'SystemConfig',
      ],
    }),
  }),
});

export const {
  useGetSystemConfigsQuery,
  useGetSystemConfigByKeyQuery,
  useCreateSystemConfigMutation,
  useUpdateSystemConfigMutation,
  useDeleteSystemConfigMutation,
} = systemConfigsApi;
