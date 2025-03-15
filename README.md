# AI 聊天项目

基于 Next.js 和 Deepseek API 构建的 AI 聊天应用。

## 版本更新

### V2.0.0 (2024年3月)
- 🔧 修复了 footer 定位问题
- 💬 优化了聊天界面布局
- 📱 改进了响应式设计
- 🎨 优化了深色模式显示效果

### V1.0.0 (初始版本)
- 🚀 项目初始化
- 💻 基础聊天功能
- 🌙 深色模式支持

## 功能特点

- ⚡ 实时 AI 对话
- 🎨 支持深色/浅色主题
- 💬 支持代码高亮显示
- 📱 响应式设计，适配多种设备
- 🔄 自动滚动到最新消息

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Deepseek API

## 开始使用

1. **克隆项目**
```bash
git clone [项目地址]
cd aichat
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env.local` 文件：
```bash
DEEPSEEK_API_KEY=your_api_key_here
```

4. **运行开发服务器**
```bash
npm run dev
```

## 项目结构
aichat/
├── app/
│ ├── components/
│ │ ├── ChatInterface.tsx # 聊天界面组件
│ │ ├── Footer.tsx # 页脚组件
│ │ └── Header.tsx # 页头组件
│ ├── api/
│ │ └── chat/
│ │ └── route.ts # API 路由处理
│ ├── layout.tsx # 布局组件
│ └── page.tsx # 主页面
├── public/ # 静态资源
└── ...

## 配置说明

### 环境变量
项目需要以下环境变量：
- `DEEPSEEK_API_KEY`: Deepseek API 密钥

### 自定义配置
- 在 `tailwind.config.js` 中自定义主题
- 在 `app/components` 中修改组件样式

## 部署

项目可以部署到 Vercel 或其他支持 Next.js 的平台。

### Vercel 部署步骤
1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署

## 注意事项

- 确保 `.env.local` 文件未被提交到版本控制
- API 密钥请妥善保管
- 定期更新依赖包以修复安全问题

