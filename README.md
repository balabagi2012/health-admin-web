This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Health Admin Web

## 開發工具與技術選擇

- **Next.js**：React 全端框架，支援 SSR、API Route，適合現代 Web 應用開發。
- **React**：主流前端 UI 框架，組件化開發，易於維護與擴充。
- **Redux Toolkit**：狀態管理工具，簡化資料流管理，方便大型專案維護。
- **Material-UI (MUI)**：Google 推出的 React UI 元件庫，快速打造美觀、響應式介面。
- **TypeScript**：型別安全的 JavaScript，提升開發效率與程式碼可靠性。
- **ESLint + Prettier**：程式碼風格與品質檢查，確保團隊協作一致性。
- **Husky + lint-staged**：Git commit 前自動格式化與檢查，減少低級錯誤進入主分支。
- **Vercel**：雲端部署平台，支援 Next.js 一鍵部署，CI/CD 自動化。

### 其他輔助工具

- **Google Sheets**：簡化部分資料流或設定的管理。

---

## 如何啟動

1. 安裝依賴：`pnpm install`
2. 設定環境變數：請參考 `.env.example`
3. 開發模式啟動：`pnpm run dev`

---

如需詳細技術說明或有任何問題，歡迎參考原始碼註解或提問！

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
