# 登录 / 登出:双端实现说明

`base-ui` 同时被 Web(Next.js)和桌面端(Tauri v2,静态导出)共享。登录态的差异集中在 **platform 层的 `tokenStore`**,`base-ui` 里的业务代码不区分设备。

## 1. 设计要点

| | Web | 桌面 (Tauri) |
|---|---|---|
| 请求发往 | 同源 Next 路由(`baseUrl: ""`),由路由代理到后端 | 直接请求后端(`baseUrl: http://...`) |
| token 存放 | HttpOnly cookie(`raven_session`),服务端写入 | 系统 keychain(Rust 侧) |
| 前端能否读到 token | 不能,`tokenStore.get()` 恒返回 `null` | 能,`tokenStore.get()` 返回 token |
| 鉴权方式 | 浏览器自动带 cookie,代理路由转成 `Authorization: Bearer` | 前端取 token 手动带 `Authorization: Bearer` |

`TokenStore` 接口(`base-ui/platform/token.ts`):

```ts
interface TokenStore {
  get(): Promise<string | null>;                       // 无 token 或已过期返回 null
  set(token: string, expiresAt: number): Promise<void>; // expiresAt 为秒级 unix 时间戳
  clear(): Promise<void>;
}
```

通过 `RavenPlatform.tokenStore` 提供,默认值是 `noopTokenStore`。

## 2. 相关文件

| 位置 | 作用 |
|---|---|
| `base-ui/core/hooks/useAuth.tsx` | `useAuth` store(`user`、`status`、persist)和 `useAuthExt`(`login` / `logout` / `restore`) |
| `base-ui/core/auth/AuthBootstrap.tsx` | 应用挂载时调用一次 `restore()` |
| `base-ui/platform/token.ts` | `TokenStore` 接口与 `noopTokenStore` |
| `web/platform/token.ts` | `cookieTokenStore`,调用 Server Action |
| `web/app/actions/session.ts` | Server Action:`storeSession` / `clearSession` |
| `web/lib/session.ts` | 读写 / 删除 cookie 的服务端工具(`server-only`) |
| `web/app/api/v1/auth/login/route.ts` | 登录代理,纯透传 |
| `web/app/api/v1/auth/me/route.ts` | 获取当前用户的代理,从 cookie 取 token |
| `app/src/platform/token.ts` | `keychainTokenStore`,`invoke` Rust 命令 |
| `app/src-tauri/src/token.rs` | `token_set` / `token_get` / `token_clear`,基于 `keyring` |

## 3. 数据结构

```ts
interface User { name: string; email: string }

// 后端 login 的原始响应 data
interface UserAuth extends User { token: string; expires_at: number /* 秒 */ }

type AuthStatus = "unknown" | "authenticated" | "anonymous";
```

- store 里只放 `User`,**不放 token**。
- `status` 初始为 `unknown`,表示"尚未检查"。

## 4. 登录流程

```
LoginForm → useAuthExt.login(req)
  → POST {baseUrl}/api/v1/auth/login
      Web:  Next 路由透传到后端
      桌面: 直接请求后端
  ← ApiResponse<UserAuth>
  → const { token, expires_at, ...user } = data.data
  → await tokenStore.set(token, expires_at)
      Web:  Server Action storeSession → cookies().set(HttpOnly)
      桌面: invoke token_set → 写入 keychain
  → setUser(user)   // status = "authenticated"
```

注意:

- **Web 的 login 响应里包含 token**(因为要交给 `tokenStore.set`),所以 token 在登录的这一瞬间会经过浏览器 JS 内存。cookie 写入后不再暴露。不要在日志、监控或错误上报里记录 login 响应体。
- `tokenStore.set` 失败(如 Linux 没有 Secret Service)目前会进入 `login` 的外层 `catch`,提示 "Network issue",此时 `user` 不会被设置。

## 5. 登录态恢复(刷新 / 重启后)

`AuthBootstrap` 在客户端挂载时调用 `restore()`:

```
token = await tokenStore.get()
桌面且 token 为空 → setAnonymous()
GET {baseUrl}/api/v1/auth/me   (桌面带 Authorization 头;Web 由 cookie 经代理路由转成该头)
  200 → setUser(user)           // authenticated
  401 → tokenStore.clear() + setAnonymous()
  其他失败 → setAnonymous()     // 不清 token,它可能仍然有效
```

- Web 的 `/api/v1/auth/me` 路由读 cookie;后端返回 401 时,路由会顺带删除失效的 cookie。
- 后端 `GET /api/v1/auth/me` 已实现并验证:读取 `Authorization: Bearer`,成功返回 `ApiResponse<User>`,失效返回 401。Web 端刷新后恢复登录态已在浏览器中验证。

### 持久化

`useAuth` 使用 zustand `persist`,key 为 `raven-auth`,只持久化 `user`(`partialize`),**`status` 不持久化**。

- 刷新后先用持久化的 `user` 渲染头像和用户名,避免空白;`status` 仍为 `unknown`,等 `restore()` 校验后才变为 `authenticated`。
- localStorage 是同步存储,zustand 创建时即完成 hydration。`useSyncExternalStore` 在水合期用 `getInitialState()`(与服务端一致),随后立刻用持久化数据重渲染,**不会产生 hydration 警告**,不需要 `skipHydration`。
- 因此 **`user` 有值 ≠ 已登录**。需要判断权限时,必须用 `status === "authenticated"`。
- 持久化内容包含 `name` / `email`,同源脚本可读。不含 token。
- 以后修改 `User` 结构,需要给 `persist` 加 `version` 和 `migrate`。

## 6. 登出流程

```
菜单 "signOut" → useAuthExt.logout()
  → await tokenStore.clear()
      Web:  Server Action clearSession → 删除 cookie
      桌面: invoke token_clear → 删除 keychain 条目
  → 成功: signOut()   // user = null, status = "anonymous",persist 同步清除
  → 失败: toast 提示,保持登录态不变
```

- 登出用的是 `logout`,不是 store 里的 `signOut`。`signOut` 只改内存状态,不会清 token。
- 目前没有通知后端作废 token(没有调用后端 logout 接口)。如果后端有会话表,需要补上。
- 登出后页面上已有的会话数据(对话列表等)不会被重置。

## 7. 本地开发(无 https)

cookie 的 `Secure` 规则在 `web/lib/session.ts` 的 `isSecure()`:

- `COOKIE_SECURE=true` / `false` 显式覆盖;
- 未设置时,生产环境为 `true`,其他环境为 `false`。

`web/.env.development` 已设置 `COOKIE_SECURE=false`。其他 cookie 属性:`httpOnly`、`sameSite: "lax"`、`path: "/"`、`expires` 取自 `expires_at`。

## 8. 安全注意事项

- **XSS:** HttpOnly 只能防止 token 被读走,防不了会话被借用(脚本可以发同源请求,浏览器会自动带 cookie)。仍然需要 CSP 和输出转义。
- **Server Action 是公开的 POST 入口。** `storeSession` 校验了参数类型,但不校验 token 真伪;伪造的 token 会被后端拒绝。新增 action 时同样要校验参数。
- **`sameSite: "lax"`** 而非 `strict`,避免从外部链接进入时第一次请求不带 cookie。需要更严格时再调整,并配合 CSRF 防护。
- **桌面端 Linux** 依赖 Secret Service(GNOME Keyring / KWallet)。没有运行它的环境里 `token_set` 会返回错误。
- 客户端的登录态只用于界面引导,**不是安全边界**。受保护页面必须在服务端(Web:服务端 layout 读 cookie)或后端接口处再校验。

## 9. 待办 / 已知缺口

- Web 的 `conversations`、`chat`、`models` 代理路由还没有用 `getSessionToken()` 转发 `Authorization`。
- 桌面端的业务请求还没有从 `tokenStore.get()` 取 token 带上 `Authorization`。
- Get Started 按钮的分流(已登录进工作台,否则弹登录框)与工作台路由的服务端校验还没有做。建议按钮在点击时用 `useAuth.getState().status` 判断,不依赖渲染时的状态。
- `AccountLoginForm`、`OtpLoginForm`、`WechatLoginPanel` 仍在使用 `useAuth()` 的 `login`,而 `login` 在 `useAuthExt` 里,存在类型错误,需要改用 `useAuthExt()`。
- 桌面端的 `AuthBootstrap` 已挂载,但桌面 layout 还没有挂载 `LoginModal`。
