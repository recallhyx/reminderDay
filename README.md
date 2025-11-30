# 记记日子 (ReminderDay)

一个基于 Taro + React + 微信云开发的纪念日记录小程序，帮助你记录和提醒重要的日子。

## 📱 项目简介

记记日子是一款微信小程序，用于记录和管理重要的纪念日，如生日、纪念日、工作重要日期等。支持置顶、重复提醒、分类标签等功能。

## ✨ 功能特性

- 📅 **纪念日管理**：创建、编辑、删除纪念日
- ⭐ **置顶功能**：重要日子可以置顶显示
- 🔁 **重复提醒**：支持每年重复的纪念日
- 🏷️ **分类标签**：生日、恋爱、工作等多种分类
- 📊 **时间计算**：自动计算距离目标日期的天数
- ☁️ **云存储**：数据存储在微信云数据库中，安全可靠
- 🎨 **精美UI**：简洁美观的界面设计

## 🛠️ 技术栈

- **框架**：Taro 3.3.6
- **UI库**：React 17.0
- **语言**：TypeScript 3.7
- **样式**：Sass
- **云服务**：微信云开发
- **日期处理**：dayjs
- **包管理**：pnpm

## 📋 环境要求

- Node.js >= 16.x (推荐使用 Node.js 20.x)
- pnpm >= 7.x (或 npm/yarn)
- 微信开发者工具
- 微信小程序账号（已开通云开发）

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd reminderDay
```

### 2. 安装依赖

```bash
# 进入客户端目录
cd client

# 使用 pnpm 安装依赖（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 配置云开发

1. 在微信开发者工具中打开项目
2. 在 `project.config.json` 中配置你的 `appid`
3. 在微信开发者工具中开通云开发服务
4. 获取云环境 ID（如果需要，可在 `client/src/app.ts` 中配置）

### 4. 启动开发

```bash
# 在 client 目录下执行
pnpm run dev:weapp

# 或使用 npm
npm run dev:weapp
```

### 5. 在微信开发者工具中预览

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目根目录
4. 点击"编译"按钮

## 📁 项目结构

```
reminderDay/
├── client/                 # 小程序客户端代码
│   ├── src/               # 源代码目录
│   │   ├── app.ts         # 应用入口
│   │   ├── app.config.ts  # 应用配置
│   │   ├── pages/         # 页面目录
│   │   │   ├── index/     # 首页
│   │   │   ├── createDay/ # 创建日子页
│   │   │   ├── modifyDay/ # 修改日子页
│   │   │   └── detail/    # 详情页
│   │   ├── components/    # 组件目录
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── utils/         # 工具函数
│   │   └── assets/         # 静态资源
│   ├── config/            # Taro 配置文件
│   ├── dist/              # 编译输出目录
│   └── package.json       # 项目依赖
├── cloud/                 # 云函数目录
│   └── functions/         # 云函数
│       ├── createDay/     # 创建日子
│       ├── deleteDay/     # 删除日子
│       ├── getDayList/    # 获取日子列表
│       ├── modifyDay/     # 修改日子
│       ├── setTopDay/     # 置顶日子
│       └── login/         # 登录
├── project.config.json    # 微信小程序项目配置
└── README.md              # 项目说明文档
```

## 📝 可用脚本

在 `client` 目录下执行：

```bash
# 开发模式（微信小程序，监听文件变化）
pnpm run dev:weapp

# 构建生产版本（微信小程序）
pnpm run build:weapp

# 其他平台构建
pnpm run build:h5      # H5
pnpm run build:swan    # 百度小程序
pnpm run build:alipay  # 支付宝小程序
pnpm run build:tt      # 字节跳动小程序
pnpm run build:qq      # QQ小程序
pnpm run build:jd      # 京东小程序
```

## 🔧 开发说明

### 云函数开发

云函数位于 `cloud/functions/` 目录下，每个云函数都是独立的目录。

### 页面开发

页面位于 `client/src/pages/` 目录下，每个页面包含：
- `index.tsx` - 页面组件
- `index.scss` - 页面样式
- `index.config.ts` - 页面配置

### 组件开发

公共组件位于 `client/src/components/` 目录下。

### 自定义 Hooks

- `useCloudFunction` - 云函数调用 Hook，封装了云函数调用的通用逻辑

## ⚠️ 注意事项

### Node.js 版本兼容性

项目使用 Taro 3.3.6，在 Node.js 17+ 环境下需要添加 `NODE_OPTIONS=--openssl-legacy-provider` 环境变量。项目已通过 `cross-env` 自动处理，无需手动配置。

### 云函数初始化

云函数在 `app.ts` 的 `componentDidMount` 中初始化，确保在使用云函数前已完成初始化。

### 构建问题

如果遇到构建错误：
1. 确保 Node.js 版本 >= 16.x
2. 清除 `node_modules` 和锁文件后重新安装
3. 检查 `tsconfig.json` 配置是否正确

## 🐛 常见问题

### 1. 白屏问题

如果小程序启动后出现白屏：
- 检查控制台是否有错误信息
- 确认云函数是否已正确部署
- 检查云环境配置是否正确

### 2. 云函数调用失败

- 确认云开发服务已开通
- 检查云函数是否已部署
- 查看控制台错误信息

### 3. 构建失败

- 确保已安装所有依赖
- 检查 Node.js 版本
- 清除缓存后重新构建

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题或建议，请提交 Issue。

---

**注意**：本项目为个人项目，仅供学习交流使用。


