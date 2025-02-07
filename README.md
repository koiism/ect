# 探索中国旅游网站

这是一个基于 [Payload CMS](https://payloadcms.com) 和 [Next.js](https://nextjs.org) 构建的现代化跨境旅游网站。本项目包含完整的后台管理系统和精心设计的前端展示网站。

## 项目概览

这个项目适合以下场景:

- 跨境旅游产品展示和预订
- 多语言内容管理(中文/英文)
- 旅游目的地城市管理
- 产品预订和客户服务

## 核心功能

- 产品管理
  - 旅游产品详情
  - 价格和可订日期管理
  - 产品图片管理
  - 产品亮点和注意事项

- 城市管理
  - 城市基本信息
  - 城市主题色
  - 城市图片

- 多语言支持
  - 中英文切换
  - 内容本地化

- 系统功能
  - [用户认证](#用户认证)
  - [权限控制](#权限控制)
  - [内容预览](#内容预览)
  - [SEO优化](#seo)
  - [响应式设计](#响应式设计)

## 快速开始

### 开发环境

1. 克隆项目

```bash
git clone <repository-url>
```

2. 安装依赖

```bash
cd <project-name>
cp .env.example .env
pnpm install
```

3. 启动开发环境

```bash
pnpm dev
```

4. 访问网站

- 前台网站: http://localhost:3000
- 管理后台: http://localhost:3000/admin

### Docker部署

也可以使用Docker快速部署:

1. 复制环境变量文件

```bash
cp .env.example .env
```

2. 启动Docker容器

```bash
docker-compose up
```

## 技术栈

- [Next.js 14](https://nextjs.org) - React框架
- [Payload CMS](https://payloadcms.com) - Headless CMS
- [TypeScript](https://www.typescriptlang.org) - 类型检查
- [TailwindCSS](https://tailwindcss.com) - 样式框架
- [shadcn/ui](https://ui.shadcn.com) - UI组件库

## 项目结构

```
src/
├── app/ # Next.js应用目录
│ ├── (frontend)/ # 前台页面
│ └── admin/ # 后台管理
├── collections/ # Payload集合配置
│ ├── Products/ # 产品集合
│ ├── Cities/ # 城市集合
│ └── Users/ # 用户集合
├── components/ # React组件
└── plugins/ # Payload插件
```


## 部署

### Vercel部署

1. 安装Vercel数据库适配器:

```bash
pnpm add @payloadcms/db-vercel-postgres
```


2. 配置数据库连接:

```ts
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
export default buildConfig({
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
})
```


### 自托管

1. 构建生产版本:

```bash
pnpm build
```

2. 启动生产环境:

```bash
pnpm start
```

## TODO

- 数据
  - 产品
    - 地理位置
- 页面
  - 搜索页面
  - 城市页面
  - Category页面
  - 404页面
- 交互体验
  - 支持多语言
  - 支持Wish List功能
  - 登录功能
- 业务功能补全
  - 支持购物车功能（多产品单次支付）
  - 旅行策划助手
  - 旅行定制服务
  - 旅行保险
  - 旅行攻略
  - 旅行社区
  - 旅游团
  - 打包产品
  - 优惠券
- SEO优化
  - 语义化标签
    - 页面跳转使用a标签
  - 页面SEO信息
  - admin交互界面SEO自动生成
  - 网站地图
  - 统计分析
  - (待补充)
- 数据分析
  - 埋点补全
- 日志与监控
  - 日志补全
  - 错误监控补全
  - 性能监控补全
