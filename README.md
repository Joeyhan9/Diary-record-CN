# Diary-record-CN

中文生活记录应用，支持分类日记、标签、搜索与导出。

## Supabase 认证配置

本项目使用 [Supabase Authentication](https://supabase.com/docs/guides/auth) 实现邮箱注册、登录与退出。

### 1. 创建 Supabase 项目

1. 在 [Supabase Dashboard](https://supabase.com/dashboard) 创建项目
2. 进入 **Project Settings → API**，复制 **Project URL** 与 **anon public key**
3. 在 **Authentication → Providers → Email** 中启用邮箱登录

### 2. 配置密钥

任选一种方式：

**方式 A — 在 `index.html` 中注入（推荐用于静态部署）：**

```html
<script>
  window.__SUPABASE_CONFIG__ = {
    url: 'https://xxxx.supabase.co',
    anonKey: 'eyJhbG...'
  };
</script>
```

**方式 B — 修改 `js/config/supabase-config.js`：**

将 `DEFAULT_CONFIG` 中的 `url` 与 `anonKey` 替换为你的项目值。

### 3. 本地运行

使用任意静态服务器打开项目（ES 模块需通过 HTTP 访问）：

```bash
npx serve .
# 或
python3 -m http.server 8080
```

## 认证行为

| 状态 | 可浏览首页 | 可保存数据 |
|------|-----------|-----------|
| 未登录 | ✅ | ❌ |
| 已登录 | ✅ | ✅ |

- 路由：`#/login` 登录、`#/register` 注册
- 登录成功后自动跳转主页（或登录前所在页面）
- 每位用户的数据独立存储在 `localStorage`（按用户 ID 隔离）

## 项目结构（认证相关）

```
js/
├── config/supabase-config.js   # Supabase 配置
├── lib/supabase-client.js      # Supabase 客户端
├── auth/
│   ├── auth-service.js         # 注册 / 登录 / 退出
│   ├── auth-state.js           # 会话状态
│   └── guards.js               # 保存权限守卫
├── components/
│   ├── auth-bar.js             # 首页登录栏
│   └── login-prompt.js         # 未登录提示
└── pages/
    ├── login.js
    └── register.js
```
