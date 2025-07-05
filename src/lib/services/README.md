# RTK Query API 服務

這個資料夾包含了所有與後端 API 互動的 RTK Query 服務。

## 服務列表

### 1. authApi.ts

認證相關的 API 服務

- `useLoginMutation` - 登入
- `useGetCurrentUserQuery` - 獲取當前用戶資訊

### 2. usersApi.ts

使用者管理 API 服務

- `useGetUsersQuery` - 獲取所有使用者
- `useGetUserByLineIdQuery` - 根據 lineId 獲取使用者
- `useCreateUserMutation` - 建立新使用者
- `useUpdateUserMutation` - 更新使用者
- `useDeleteUserMutation` - 刪除使用者

### 3. recordsApi.ts

健康記錄管理 API 服務

- `useGetRecordsQuery` - 獲取所有記錄
- `useGetRecordByIdQuery` - 根據 ID 獲取記錄
- `useGetRecordsByUserIdQuery` - 根據使用者 ID 獲取記錄
- `useGetRecordsByDateRangeQuery` - 根據日期範圍獲取記錄
- `useGetLatestRecordByUserIdQuery` - 獲取使用者最新記錄
- `useCreateRecordMutation` - 建立新記錄
- `useUpdateRecordMutation` - 更新記錄
- `useDeleteRecordMutation` - 刪除記錄

### 4. lineApi.ts

Line 機器人 API 服務

- `useHandleWebhookMutation` - 處理 webhook
- `useCreateRichMenuMutation` - 建立 Rich Menu
- `useGetRichMenuQuery` - 獲取 Rich Menu
- `useUploadRichMenuImageMutation` - 上傳 Rich Menu 圖片
- `useSetDefaultRichMenuMutation` - 設定預設 Rich Menu
- `useDeleteRichMenuMutation` - 刪除 Rich Menu

### 5. systemConfigsApi.ts

系統配置管理 API 服務

- `useGetSystemConfigsQuery` - 獲取所有系統配置
- `useGetSystemConfigByKeyQuery` - 根據 key 獲取系統配置
- `useCreateSystemConfigMutation` - 建立新系統配置
- `useUpdateSystemConfigMutation` - 更新系統配置
- `useDeleteSystemConfigMutation` - 刪除系統配置

## 使用範例

```tsx
import { useGetUsersQuery, useCreateUserMutation } from '@/lib/services';

function UsersPage() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleCreateUser = async userData => {
    try {
      await createUser(userData).unwrap();
      // 成功處理
    } catch (error) {
      // 錯誤處理
    }
  };

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 環境變數設定

在 `.env.local` 檔案中設定 API 基礎 URL：

```
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
```

## 注意事項

1. 所有 API 服務都會自動處理認證 token
2. 使用 RTK Query 的 cache 機制，避免重複請求
3. 支援樂觀更新和錯誤處理
4. 所有服務都已整合到 Redux store 中
