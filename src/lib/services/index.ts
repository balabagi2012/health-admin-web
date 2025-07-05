// 匯出所有 API 服務
export { authApi, useLoginMutation, useGetCurrentUserQuery } from './authApi';
export {
  usersApi,
  useGetUsersQuery,
  useGetUserByLineIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from './usersApi';
export {
  recordsApi,
  useGetRecordsQuery,
  useGetRecordByIdQuery,
  useGetRecordsByUserIdQuery,
  useGetRecordsByDateRangeQuery,
  useGetLatestRecordByUserIdQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
  useDeleteRecordMutation,
} from './recordsApi';
export {
  lineApi,
  useHandleWebhookMutation,
  useCreateRichMenuMutation,
  useGetRichMenuQuery,
  useUploadRichMenuImageMutation,
  useSetDefaultRichMenuMutation,
  useDeleteRichMenuMutation,
} from './lineApi';
export {
  systemConfigsApi,
  useGetSystemConfigsQuery,
  useGetSystemConfigByKeyQuery,
  useCreateSystemConfigMutation,
  useUpdateSystemConfigMutation,
  useDeleteSystemConfigMutation,
} from './systemConfigsApi';

// 匯出類型定義
export type { User, CreateUserRequest, UpdateUserRequest } from './usersApi';
export type {
  Record,
  CreateRecordRequest,
  UpdateRecordRequest,
  DateRangeParams,
} from './recordsApi';
export type {
  RichMenu,
  CreateRichMenuRequest,
  WebhookRequest,
} from './lineApi';
export type {
  SystemConfig,
  CreateSystemConfigRequest,
  UpdateSystemConfigRequest,
} from './systemConfigsApi';
