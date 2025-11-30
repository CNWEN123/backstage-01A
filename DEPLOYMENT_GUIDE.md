# 部署指南

本文档详细说明如何将真人荷官视讯系统后台管理平台部署到Cloudflare Pages。

---

## 📋 前置要求

### 1. 必需账号
- ✅ GitHub 账号
- ✅ Cloudflare 账号（免费版即可）
- ✅ Node.js >= 18.0.0
- ✅ npm >= 9.0.0

### 2. 必备工具
```bash
# 检查 Node.js 版本
node --version  # 应该 >= 18.0.0

# 检查 npm 版本
npm --version   # 应该 >= 9.0.0

# 安装 Wrangler CLI
npm install -g wrangler
```

---

## 🚀 快速部署（推荐）

### 步骤 1: 克隆项目
```bash
# 克隆仓库
git clone https://github.com/CNWEN123/backstage-01A.git
cd backstage-01A

# 安装依赖
npm install
```

### 步骤 2: 配置Cloudflare
```bash
# 登录 Cloudflare
wrangler login

# 验证登录
wrangler whoami
```

### 步骤 3: 创建D1数据库
```bash
# 创建生产数据库
wrangler d1 create webapp-production

# 复制输出的 database_id 到 wrangler.jsonc
# 找到以下部分并替换:
# "database_id": "your-database-id-here"
```

### 步骤 4: 应用数据库迁移
```bash
# 应用迁移到生产数据库
wrangler d1 migrations apply webapp-production
```

### 步骤 5: 创建 Pages 项目
```bash
# 构建项目
npm run build

# 创建 Pages 项目（只需执行一次）
wrangler pages project create webapp \
  --production-branch main \
  --compatibility-date 2024-01-01
```

### 步骤 6: 部署到 Cloudflare Pages
```bash
# 部署
wrangler pages deploy dist --project-name webapp

# 部署成功后会显示:
# ✨ Deployment complete! Take a peek over at
# https://xxxx.webapp.pages.dev
```

### 步骤 7: 绑定D1数据库到Pages
```bash
# 在 Cloudflare Dashboard 中:
# 1. 进入 Pages > webapp > Settings > Functions
# 2. 找到 D1 database bindings
# 3. 添加绑定:
#    - Variable name: DB
#    - D1 database: webapp-production
```

### 步骤 8: 访问系统
```
系统总管理后台: https://xxxx.webapp.pages.dev/
代理管理后台: https://xxxx.webapp.pages.dev/agent.html

默认账号:
- 系统管理员: admin / admin123
- 股东账号: shareholder01 / test123
- 代理账号: agent01 / test123
```

---

## 🔧 本地开发环境

### 1. 安装依赖
```bash
npm install
```

### 2. 配置本地环境
```bash
# 创建 .dev.vars 文件（可选）
cat > .dev.vars << EOF
# 本地开发环境变量
EOF
```

### 3. 应用本地数据库迁移
```bash
# 应用迁移到本地数据库
npm run db:migrate:local

# 可选: 填充测试数据
npm run db:seed
```

### 4. 启动本地开发服务器
```bash
# 方式1: 使用 Vite 开发服务器（推荐本地开发）
npm run dev

# 方式2: 使用 PM2（推荐沙箱环境）
npm run build
pm2 start ecosystem.config.cjs
pm2 logs

# 访问
http://localhost:3000/          # 系统总管理后台
http://localhost:3000/agent.html   # 代理管理后台
```

### 5. 常用开发命令
```bash
# 构建项目
npm run build

# 本地预览生产版本
npm run preview

# 运行测试
npm test

# 数据库相关
npm run db:migrate:local      # 应用本地迁移
npm run db:migrate:prod       # 应用生产迁移
npm run db:seed               # 填充测试数据
npm run db:reset              # 重置本地数据库
npm run db:console:local      # 本地数据库控制台
npm run db:console:prod       # 生产数据库控制台

# 清理端口
npm run clean-port            # 清理3000端口
```

---

## 🗄️ 数据库管理

### 创建新迁移
```bash
# 创建迁移文件
cat > migrations/0002_add_new_table.sql << EOF
-- 添加新表
CREATE TABLE IF NOT EXISTS new_table (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
EOF

# 应用迁移
npm run db:migrate:local   # 本地
npm run db:migrate:prod    # 生产
```

### 查询数据库
```bash
# 本地数据库
wrangler d1 execute webapp-production --local --command="SELECT * FROM players LIMIT 10"

# 生产数据库
wrangler d1 execute webapp-production --command="SELECT * FROM players LIMIT 10"
```

### 备份数据库
```bash
# 导出本地数据库
wrangler d1 export webapp-production --local --output=backup.sql

# 导出生产数据库（需要小心）
wrangler d1 export webapp-production --output=backup-prod.sql
```

### 恢复数据库
```bash
# 导入到本地数据库
wrangler d1 execute webapp-production --local --file=backup.sql

# 导入到生产数据库（危险操作！）
wrangler d1 execute webapp-production --file=backup.sql
```

---

## 🔐 环境变量配置

### 本地开发 (.dev.vars)
```bash
# .dev.vars 文件（不要提交到Git）
SESSION_SECRET=your-secret-key-here
ENVIRONMENT=development
```

### 生产环境
```bash
# 通过 Wrangler 设置
wrangler pages secret put SESSION_SECRET --project-name webapp
# 输入密钥后按回车

# 列出所有密钥
wrangler pages secret list --project-name webapp

# 删除密钥
wrangler pages secret delete SESSION_SECRET --project-name webapp
```

---

## 🌐 自定义域名

### 1. 添加自定义域名
```bash
# 通过 Wrangler 添加
wrangler pages domain add example.com --project-name webapp

# 或在 Cloudflare Dashboard:
# Pages > webapp > Custom domains > Set up a domain
```

### 2. DNS 配置
在您的域名 DNS 设置中添加 CNAME 记录:
```
Type: CNAME
Name: www (或 @)
Target: webapp.pages.dev
TTL: Auto
```

### 3. SSL/TLS 配置
Cloudflare 会自动为您的自定义域名配置 SSL 证书（通常需要几分钟）。

---

## 📊 监控和日志

### 实时日志
```bash
# 查看部署日志
wrangler pages deployment list --project-name webapp

# 查看特定部署的日志
wrangler pages deployment tail --project-name webapp
```

### Cloudflare Analytics
1. 登录 Cloudflare Dashboard
2. 进入 Pages > webapp > Analytics
3. 查看访问量、带宽、请求数等数据

### 错误追踪
在 `src/index.tsx` 中添加错误日志:
```typescript
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: err.message }, 500)
})
```

---

## 🔄 持续部署

### 方式1: GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=webapp
```

设置 GitHub Secrets:
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

### 方式2: Wrangler 手动部署
```bash
# 每次代码更新后
git pull
npm install
npm run build
wrangler pages deploy dist --project-name webapp
```

---

## 🛠️ 故障排查

### 问题1: 部署失败
```bash
# 检查构建日志
npm run build

# 检查 wrangler 配置
cat wrangler.jsonc

# 验证 Cloudflare 登录
wrangler whoami
```

### 问题2: 数据库连接失败
```bash
# 检查 D1 绑定
wrangler pages project list

# 验证数据库迁移
wrangler d1 migrations list webapp-production

# 测试数据库查询
wrangler d1 execute webapp-production --command="SELECT 1"
```

### 问题3: 页面404错误
```bash
# 检查 dist 目录
ls -la dist/

# 验证路由配置
cat dist/_routes.json

# 检查是否正确构建
npm run build
```

### 问题4: API返回500错误
```bash
# 查看实时日志
wrangler pages deployment tail --project-name webapp

# 检查错误信息
# 登录 Cloudflare Dashboard > Pages > webapp > Deployments > View logs
```

---

## 📈 性能优化

### 1. 启用缓存
在 `wrangler.jsonc` 中配置:
```jsonc
{
  "routes": [
    {
      "pattern": "/static/*",
      "cache": {
        "maxAge": 86400
      }
    }
  ]
}
```

### 2. 压缩资源
```bash
# 已经在构建过程中自动启用
npm run build
```

### 3. CDN优化
- 静态资源已自动通过 Cloudflare CDN 分发
- 全球边缘节点加速访问
- 自动 Brotli/Gzip 压缩

---

## 🔒 安全建议

### 1. 立即修改默认密码
首次部署后:
```
1. 登录系统总管理后台
2. 进入「系统设置」>「修改密码」
3. 修改默认管理员密码
```

### 2. 启用2FA
```
1. 进入「系统设置」>「双因素认证」
2. 扫描二维码
3. 输入验证码启用
```

### 3. 配置访问限制
在 Cloudflare Dashboard 中:
```
1. 进入 Pages > webapp > Settings > Access
2. 配置 IP 白名单
3. 或启用 Cloudflare Access
```

### 4. 定期备份
```bash
# 每周备份一次数据库
wrangler d1 export webapp-production --output=backup-$(date +%Y%m%d).sql

# 保存到安全的地方
```

---

## 📞 技术支持

如果遇到问题:
1. 查看本文档的故障排查部分
2. 查看 [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
3. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
4. 提交 GitHub Issue

---

## 🎓 相关资源

- [Hono 框架文档](https://hono.dev/)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
- [TailwindCSS 文档](https://tailwindcss.com/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

© 2024 真人荷官视讯系统 部署指南
