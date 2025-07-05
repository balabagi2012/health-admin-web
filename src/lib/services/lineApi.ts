import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface WebhookRequest {
  events: unknown[];
}

export interface RichMenu {
  id: string;
  name: string;
  size: {
    width: number;
    height: number;
  };
  selected: boolean;
  chatBarText: string;
  areas: unknown[];
}

export interface CreateRichMenuRequest {
  name: string;
  size: {
    width: number;
    height: number;
  };
  selected: boolean;
  chatBarText: string;
  areas: unknown[];
}

export const lineApi = createApi({
  reducerPath: 'lineApi',
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
  tagTypes: ['RichMenu'],
  endpoints: builder => ({
    // 處理 webhook
    handleWebhook: builder.mutation<void, WebhookRequest>({
      query: webhookData => ({
        url: '/line/webhook',
        method: 'POST',
        body: webhookData,
      }),
    }),

    // 建立 Rich Menu
    createRichMenu: builder.mutation<RichMenu, CreateRichMenuRequest>({
      query: richMenuData => ({
        url: '/line/rich-menu',
        method: 'POST',
        body: richMenuData,
      }),
      invalidatesTags: ['RichMenu'],
    }),

    // 獲取 Rich Menu
    getRichMenu: builder.query<RichMenu[], void>({
      query: () => '/line/rich-menu',
      providesTags: ['RichMenu'],
    }),

    // 上傳 Rich Menu 圖片
    uploadRichMenuImage: builder.mutation<
      void,
      { richMenuId: string; image: File }
    >({
      query: ({ richMenuId, image }) => {
        const formData = new FormData();
        formData.append('image', image);
        return {
          url: '/line/rich-menu/upload',
          method: 'POST',
          body: formData,
          headers: {
            'rich-menu-id': richMenuId,
          },
        };
      },
      invalidatesTags: ['RichMenu'],
    }),

    // 設定預設 Rich Menu
    setDefaultRichMenu: builder.mutation<void, string>({
      query: richMenuId => ({
        url: '/line/rich-menu/default',
        method: 'POST',
        body: { richMenuId },
      }),
      invalidatesTags: ['RichMenu'],
    }),

    // 刪除 Rich Menu
    deleteRichMenu: builder.mutation<void, string>({
      query: richMenuId => ({
        url: `/line/rich-menu/${richMenuId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RichMenu'],
    }),
  }),
});

export const {
  useHandleWebhookMutation,
  useCreateRichMenuMutation,
  useGetRichMenuQuery,
  useUploadRichMenuImageMutation,
  useSetDefaultRichMenuMutation,
  useDeleteRichMenuMutation,
} = lineApi;
