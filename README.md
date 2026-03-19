# 🎵 仿网易云音乐网页版

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.3.4-brightgreen.svg"/>
  <img src="https://img.shields.io/badge/Vite-4.5.1-green.svg"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0.2-blue.svg"/>
  <img src="https://img.shields.io/badge/Element%20Plus-2.3.12-orange.svg"/>
  <img src="https://img.shields.io/badge/Pinia-2.1.6-purple.svg"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg"/>
</p>

## 📖 项目介绍

这是一个基于现代前端技术栈（Vue 3 + TypeScript + Vite）构建的网易云音乐网页版。项目专注于核心音乐体验，实现了音乐播放、歌单管理、搜索等核心功能，并采用组件化、模块化的设计思想，是一个学习 Vue 3 全家桶和前端工程化的实践项目。

### ✨ 技术栈

| 技术 | 用途 |
| :--- | :--- |
| **Vue 3** | 采用 Composition API 构建响应式用户界面 |
| **TypeScript** | 为项目提供静态类型检查，提升代码健壮性与可维护性 |
| **Vite** | 下一代前端构建工具，提供极速的开发服务器与构建打包 |
| **Pinia** | Vue 官方推荐的状态管理库，用于管理播放器、用户等全局状态 |
| **Vue Router** | 管理页面路由，实现单页应用导航与路由守卫 |
| **Element Plus** | 基于 Vue 3 的 UI 组件库，用于快速搭建界面 |
| **Axios** | 封装 HTTP 请求，与网易云音乐 API 进行交互 |
| **SCSS** | 使用 CSS 预处理器编写更高效、可维护的样式 |

## ✨ 功能特性

### 🎵 核心音乐播放
*   **播放控制**：支持播放/暂停、上一曲/下一曲、进度条拖动、音量调节。
*   **播放模式**：提供顺序播放、单曲循环、随机播放三种模式。
*   **播放列表**：侧边栏展示当前播放列表，支持单曲删除、清空列表。

### 📋 歌单系统
*   **歌单展示**：首页推荐歌单、最新音乐。
*   **歌单详情**：查看歌单内歌曲列表、歌单信息。
*   **歌单管理**：支持创建歌单、收藏/取消收藏歌单、批量删除歌单。

### 🔍 搜索功能
*   **多类型搜索**：支持搜索歌曲、歌单。
*   **搜索建议**：输入时提供实时搜索建议。
*   **搜索结果**：分类展示搜索结果，点击可播放歌曲或跳转歌单。

### 👤 用户系统
*   **登录方式**：支持手机号密码登录、二维码登录，并提供 Cookie 手动登录作为开发备用方案。
*   **状态持久化**：登录状态持久化存储，刷新页面无需重新登录。
*   **用户菜单**：已登录用户可查看信息、跳转歌单、退出登录。

## 🚀 快速开始

### 环境准备
*   Node.js 18+
*   pnpm (推荐) 或 npm

### 安装与运行

1.  **克隆项目**
    ```bash
    git clone https://gitee.com/jiayizzz/wyy-music.git
    cd wyy-music
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    # 或
    npm install
    ```

3.  **启动 API 服务（重要）**
    本项目依赖 [NeteaseCloudMusicApi](https://neteasecloudmusicapienhanced.js.org/#/) 提供真实数据。你需要单独下载并运行该 API 服务。
    ```bash
    # 克隆 API 服务项目
    git clone https://github.com/neteasecloudmusicapienhanced/api-enhanced.git
    cd NeteaseCloudMusicApi
    npm install
    node app.js
    ```
    API 服务默认运行在 `http://localhost:3000`。

4.  **启动前端项目**
    ```bash
    # 回到前端项目目录
    cd wyy-music
    pnpm run dev
    ```
    应用将在 `http://localhost:5173` 启动。

### 环境变量配置

在项目根目录创建 `.env.development` 文件，用于配置 API 地址：
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 📁 项目结构

```
wyy-music/
├── public/                 # 静态资源
├── src/
│   ├── api/                # API 接口封装
│   ├── assets/             # 项目静态资源 (图片、字体等)
│   ├── components/         # 公共组件
│   │   ├── player/         # 播放器相关组件
│   │   └── search/         # 搜索相关组件
│   ├── layouts/            # 布局组件
│   ├── mock/               # 模拟数据 (开发备用)
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia 状态管理
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── .env.development        # 开发环境变量
├── index.html              # HTML 模板
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
└── vite.config.ts          # Vite 配置
```

## 🔧 核心组件概览

*   **`PlayerBar`**: 底部固定播放控制栏，管理播放状态、进度、音量。
*   **`PlaylistSidebar`**: 侧边栏展示当前播放列表，支持歌曲操作。
*   **`SearchBar`**: 顶部搜索框，包含输入防抖和搜索建议。
*   **`PlaylistDetail`**: 歌单详情页，展示歌曲列表和歌单信息。
*   **`MyPlaylists`**: 我的歌单页，区分用户创建和收藏的歌单。

## 🎯 项目亮点

1.  **完整的播放器逻辑**：独立封装播放器 Store，通过 `watch` 和 `computed` 精细控制 audio 元素，实现流畅的播放体验。
2.  **模块化状态管理**：使用 Pinia 拆分 `player` 和 `user` 模块，职责清晰，易于维护。
3.  **TypeScript 深度应用**：为 API 响应、组件 Props、Store 状态定义完整类型，提升代码质量。
4.  **组件化开发**：页面拆分为多个可复用组件，组件间通过 Props/Emits 和全局状态通信。
5.  **真实 API 对接**：接入开源网易云 API，实现真实数据交互，并设计数据转换层统一处理数据格式。

## 🚢 部署指南

1.  **构建项目**
    ```bash
    pnpm run build
    ```
    构建产物将生成在 `dist` 目录。

2.  **部署前端**
    将 `dist` 目录下的文件部署到你的 Web 服务器（如 Nginx、Vercel、Netlify）。

3.  **部署 API 服务**
    为确保线上环境稳定运行，建议将 `NeteaseCloudMusicApi` 部署到云服务器（如 Vercel、阿里云等），并修改前端的 `VITE_API_BASE_URL` 为线上 API 地址。

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

感谢以下开源项目和社区的支持，让这个项目得以实现：

### 核心依赖
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 类型超集
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库
- [Vue Router](https://router.vuejs.org/) - Vue 官方路由
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Axios](https://axios-http.com/) - HTTP 客户端

### 数据支持
- [NeteaseCloudMusicApi](https://gitcode.com/Binaryify/NeteaseCloudMusicApi) - 网易云音乐 API 服务
- [@neteasecloudmusicapienhanced/api](https://github.com/neteasecloudmusicapienhanced/api-enhanced) - 增强版 API 服务

### 开发工具
- [VS Code](https://code.visualstudio.com/) - 代码编辑器
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 开发工具
- [ESLint](https://eslint.org/) - 代码规范检查
- [Prettier](https://prettier.io/) - 代码格式化

### 设计参考
- [网易云音乐](https://music.163.com/) - UI 设计灵感来源

### 特别感谢
感谢所有贡献者和开源社区的支持，以及在学习过程中提供帮助的开发者们。

---

**如果这个项目对你有帮助，欢迎 Star ⭐ 支持！**