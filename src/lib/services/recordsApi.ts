import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Record {
  _id: string;
  userId: string;
  weight?: number;
  hba1c?: number;
  bloodSugar?: number;
  systolicPressure?: number;
  diastolicPressure?: number;
  ldl?: number;
  hdl?: number;
  tg?: number;
  recordDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecordRequest {
  userId: string;
  weight?: number;
  hba1c?: number;
  bloodSugar?: number;
  systolicPressure?: number;
  diastolicPressure?: number;
  ldl?: number;
  hdl?: number;
  tg?: number;
  recordDate?: string;
}

export interface UpdateRecordRequest {
  weight?: number;
  hba1c?: number;
  bloodSugar?: number;
  systolicPressure?: number;
  diastolicPressure?: number;
  ldl?: number;
  hdl?: number;
  tg?: number;
  recordDate?: string;
}

export interface DateRangeParams {
  userId: string;
  startDate: string;
  endDate: string;
}

export const recordsApi = createApi({
  reducerPath: 'recordsApi',
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
  tagTypes: ['Record'],
  endpoints: builder => ({
    // 獲取所有記錄
    getRecords: builder.query<Record[], void>({
      query: () => '/records',
      providesTags: ['Record'],
    }),

    // 根據 ID 獲取單一記錄
    getRecordById: builder.query<Record, string>({
      query: id => `/records/${id}`,
      providesTags: (result, error, id) => [{ type: 'Record', id }],
    }),

    // 根據使用者 ID 獲取記錄
    getRecordsByUserId: builder.query<Record[], string>({
      query: userId => `/records/user/${userId}`,
      providesTags: result => [
        { type: 'Record', id: 'LIST' },
        ...(result?.map(({ _id }) => ({ type: 'Record' as const, id: _id })) ??
          []),
      ],
    }),

    // 根據日期範圍獲取記錄
    getRecordsByDateRange: builder.query<Record[], DateRangeParams>({
      query: ({ userId, startDate, endDate }) =>
        `/records/user/${userId}/date-range?startDate=${startDate}&endDate=${endDate}`,
      providesTags: result => [
        { type: 'Record', id: 'LIST' },
        ...(result?.map(({ _id }) => ({ type: 'Record' as const, id: _id })) ??
          []),
      ],
    }),

    // 獲取使用者最新記錄
    getLatestRecordByUserId: builder.query<Record, string>({
      query: userId => `/records/user/${userId}/latest`,
      providesTags: result => [
        { type: 'Record', id: 'LATEST' },
        ...(result ? [{ type: 'Record' as const, id: result._id }] : []),
      ],
    }),

    // 建立新記錄
    createRecord: builder.mutation<Record, CreateRecordRequest>({
      query: recordData => ({
        url: '/records',
        method: 'POST',
        body: recordData,
      }),
      invalidatesTags: ['Record'],
    }),

    // 更新記錄
    updateRecord: builder.mutation<
      Record,
      { id: string; data: UpdateRecordRequest }
    >({
      query: ({ id, data }) => ({
        url: `/records/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Record', id },
        'Record',
      ],
    }),

    // 刪除記錄
    deleteRecord: builder.mutation<void, string>({
      query: id => ({
        url: `/records/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Record'],
    }),
  }),
});

export const {
  useGetRecordsQuery,
  useGetRecordByIdQuery,
  useGetRecordsByUserIdQuery,
  useGetRecordsByDateRangeQuery,
  useGetLatestRecordByUserIdQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} = recordsApi;
