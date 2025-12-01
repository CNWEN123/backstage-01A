# API 接口文档

## 基础信息

- **Base URL**: `https://your-domain.pages.dev`
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 目录

1. [认证接口](#认证接口)
2. [玩家管理](#玩家管理)
3. [代理管理](#代理管理)
4. [财务管理](#财务管理)
5. [红利与洗码](#红利与洗码)
6. [风控管理](#风控管理)
7. [报表中心](#报表中心)
8. [系统管理](#系统管理)
9. [直播间管理](#直播间管理)
10. [代理后台专用](#代理后台专用)

---

## 认证接口

### 1.1 管理员登录
```
POST /api/auth/login
```

**请求参数**:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**响应**:
```json
{
  "success": true,
  "session_id": "abc123...",
  "admin": {
    "id": 1,
    "username": "admin",
    "role": "super_admin"
  }
}
```

### 1.2 退出登录
```
POST /api/auth/logout
```

### 1.3 获取当前会话
```
GET /api/auth/session
```

---

## 玩家管理

### 2.1 获取玩家列表
```
GET /api/players?page=1&limit=20&search=&status=&agent_id=&vip_level=
```

**查询参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）
- `search`: 搜索关键词（账号/姓名/手机）
- `status`: 状态筛选（active/disabled）
- `agent_id`: 代理ID筛选
- `vip_level`: VIP等级筛选

**响应**:
```json
{
  "list": [
    {
      "id": 1,
      "username": "player001",
      "name": "张三",
      "phone": "13800138000",
      "balance": 10000,
      "status": "active",
      "vip_level": 1,
      "agent_id": 5,
      "agent_name": "代理A",
      "created_at": "2024-01-01 00:00:00"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### 2.2 获取玩家详情
```
GET /api/players/:id
```

**响应**:
```json
{
  "id": 1,
  "username": "player001",
  "name": "张三",
  "phone": "13800138000",
  "email": "player001@example.com",
  "balance": 10000,
  "status": "active",
  "vip_level": 1,
  "agent_id": 5,
  "agent_name": "代理A",
  "commission_scheme_id": 1,
  "total_bet": 50000,
  "total_win_loss": -5000,
  "created_at": "2024-01-01 00:00:00",
  "last_login": "2024-11-30 12:00:00"
}
```

### 2.3 添加玩家
```
POST /api/players
```

**请求参数**:
```json
{
  "username": "player002",
  "name": "李四",
  "phone": "13800138001",
  "email": "player002@example.com",
  "password": "123456",
  "agent_id": 5,
  "vip_level": 1,
  "commission_scheme_id": 1
}
```

### 2.4 更新玩家
```
PUT /api/players/:id
```

**请求参数**:
```json
{
  "name": "李四",
  "phone": "13800138001",
  "vip_level": 2,
  "status": "active"
}
```

### 2.5 修改玩家状态
```
PUT /api/players/:id/status
```

**请求参数**:
```json
{
  "status": "disabled"  // active 或 disabled
}
```

### 2.6 转移玩家代理
```
POST /api/players/:id/transfer-agent
```

**请求参数**:
```json
{
  "new_agent_id": 10
}
```

---

## 代理管理

### 3.1 获取代理列表
```
GET /api/agents?page=1&limit=20&search=&level=&parent_id=
```

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `search`: 搜索关键词
- `level`: 代理级别（1-5）
- `parent_id`: 上级代理ID

**响应**:
```json
{
  "list": [
    {
      "id": 5,
      "username": "agent001",
      "name": "代理A",
      "level": 1,
      "parent_id": null,
      "commission_rate": 0.05,
      "share_ratio": 0.30,
      "player_count": 50,
      "sub_agent_count": 10,
      "total_bet": 1000000,
      "total_commission": 50000,
      "status": "active",
      "created_at": "2024-01-01 00:00:00"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20
}
```

### 3.2 获取代理树
```
GET /api/agents/tree?agent_id=
```

**响应**:
```json
{
  "id": 1,
  "username": "agent001",
  "name": "代理A",
  "level": 1,
  "children": [
    {
      "id": 2,
      "username": "agent002",
      "name": "代理B",
      "level": 2,
      "children": []
    }
  ]
}
```

### 3.3 获取代理详情
```
GET /api/agents/:id
```

### 3.4 获取代理业绩
```
GET /api/agents/:id/performance?start_date=2024-11-01&end_date=2024-11-30
```

**响应**:
```json
{
  "total_bet": 1000000,
  "total_win_loss": -100000,
  "total_commission": 50000,
  "player_count": 50,
  "bet_count": 5000,
  "daily_stats": [
    {
      "date": "2024-11-01",
      "bet_amount": 50000,
      "win_loss": -5000,
      "commission": 2500
    }
  ]
}
```

### 3.5 添加代理
```
POST /api/agents
```

**请求参数**:
```json
{
  "username": "agent003",
  "name": "代理C",
  "phone": "13800138003",
  "password": "123456",
  "parent_id": 1,
  "level": 2,
  "commission_rate": 0.04,
  "share_ratio": 0.25,
  "invite_code": "ABC123"
}
```

### 3.6 更新代理
```
PUT /api/agents/:id
```

### 3.7 重新生成邀请链接
```
POST /api/agents/:id/regenerate-invite
```

**响应**:
```json
{
  "invite_code": "XYZ789",
  "invite_url": "https://your-domain.com/register?code=XYZ789"
}
```

---

## 财务管理

### 4.1 获取交易记录
```
GET /api/transactions?page=1&limit=20&type=&status=&start_date=&end_date=
```

**查询参数**:
- `type`: 交易类型（deposit/withdraw/transfer/commission/bonus）
- `status`: 状态（pending/approved/rejected/completed）
- `start_date`: 开始日期
- `end_date`: 结束日期

### 4.2 获取提款申请
```
GET /api/withdraws?status=pending
```

**响应**:
```json
{
  "list": [
    {
      "id": 1,
      "player_id": 10,
      "player_name": "张三",
      "amount": 5000,
      "status": "pending",
      "bank_name": "中国银行",
      "bank_account": "6222****1234",
      "created_at": "2024-11-30 10:00:00"
    }
  ],
  "total": 5
}
```

### 4.3 审核提款
```
PUT /api/withdraws/:id
```

**请求参数**:
```json
{
  "status": "approved",  // approved 或 rejected
  "remark": "审核通过"
}
```

### 4.4 获取存款记录
```
GET /api/deposits?status=pending
```

### 4.5 确认存款
```
PUT /api/deposits/:id
```

### 4.6 获取收款方式
```
GET /api/payment-methods
```

### 4.7 添加收款方式
```
POST /api/payment-methods
```

**请求参数**:
```json
{
  "type": "bank_card",  // bank_card, alipay, wechat, usdt
  "name": "中国银行",
  "account": "6222 0000 1234 5678",
  "account_name": "张三",
  "status": "active"
}
```

---

## 红利与洗码

### 5.1 获取洗码记录
```
GET /api/commission/records?status=&page=1&limit=20
```

**查询参数**:
- `status`: 状态（0=待发放, 1=已发放, 2=已拒绝）

**响应**:
```json
{
  "list": [
    {
      "id": 1,
      "player_id": 10,
      "player_name": "张三",
      "game_type": "百家乐",
      "valid_bet": 100000,
      "commission_rate": 0.02,
      "commission_amount": 2000,
      "status": 0,
      "created_at": "2024-11-30 00:00:00"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "stats": {
    "pending_count": 10,
    "pending_amount": 20000,
    "approved_count": 40,
    "approved_amount": 80000
  }
}
```

### 5.2 审核洗码
```
PUT /api/commission/records/:id
```

**请求参数**:
```json
{
  "status": 1,  // 1=通过, 2=拒绝
  "remark": "审核通过"
}
```

### 5.3 获取洗码方案
```
GET /api/commission/schemes
```

### 5.4 添加洗码方案
```
POST /api/commission/schemes
```

**请求参数**:
```json
{
  "name": "VIP方案",
  "game_type": "百家乐",
  "commission_rate": 0.02,
  "min_valid_bet": 10000,
  "status": "active"
}
```

---

## 报表中心

### 7.1 盈亏日报
```
GET /api/reports/daily?start_date=2024-11-01&end_date=2024-11-30
```

**响应**:
```json
{
  "list": [
    {
      "date": "2024-11-01",
      "total_bet": 100000,
      "valid_bet": 95000,
      "total_payout": 90000,
      "company_profit": 10000,
      "player_count": 50,
      "bet_count": 500
    }
  ],
  "summary": {
    "total_bet": 3000000,
    "valid_bet": 2850000,
    "company_profit": 300000
  }
}
```

### 7.2 游戏报表
```
GET /api/reports/game?start_date=&end_date=&game_type=
```

### 7.3 注单明细
```
GET /api/reports/bets?page=1&limit=20&start_date=&end_date=&player_id=
```

### 7.4 代理业绩
```
GET /api/reports/agent-performance?start_date=&end_date=&agent_id=
```

**响应**:
```json
{
  "list": [
    {
      "agent_id": 5,
      "agent_name": "代理A",
      "level": 1,
      "sub_agent_count": 10,
      "player_count": 50,
      "total_bet": 1000000,
      "win_loss": -100000,
      "wash_code_fee": 20000,
      "agent_share": 30000,
      "company_profit": 70000
    }
  ],
  "summary": {
    "total_agents": 50,
    "total_players": 500,
    "total_bet": 10000000,
    "company_profit": 1000000
  }
}
```

---

## 代理后台专用

### 10.1 代理登录
```
POST /api/agent/login
```

**请求参数**:
```json
{
  "username": "your_agent_username",
  "password": "your_password"
}
```

### 10.2 代理统计
```
GET /api/agent/stats
```

**响应**:
```json
{
  "total_commission": 50000,
  "month_commission": 10000,
  "balance": 45000,
  "player_count": 50,
  "sub_agent_count": 10,
  "month_bet": 1000000
}
```

### 10.3 游戏报表
```
GET /api/agent/game-report?start_date=&end_date=&player_name=
```

**响应**:
```json
{
  "list": [
    {
      "player_name": "张三",
      "total_bet": 100000,
      "valid_bet": 95000,
      "win_loss": -10000,
      "wash_code_fee": 1900,
      "bet_count": 100
    }
  ],
  "summary": {
    "total_bet": 1000000,
    "valid_bet": 950000,
    "win_loss": -100000,
    "wash_code_fee": 19000
  }
}
```

### 10.4 玩家游戏详情（新增）
```
GET /api/agent/player-game-detail?player_name=张三&start_date=&end_date=
```

**响应**:
```json
{
  "player_summary": {
    "player_name": "张三",
    "total_bet": 850000,
    "valid_bet": 807500,
    "total_win_loss": -125000,
    "total_wash_fee": 16150,
    "bet_count": 10
  },
  "detail_list": [
    {
      "game_id": "G20241130101",
      "game_type_display": "百家乐",
      "table_name": "T01",
      "round_id": "R12345",
      "bet_item": "庄",
      "bet_amount": 50000,
      "valid_bet": 47500,
      "win_loss": -50000,
      "wash_code_fee": 950,
      "bet_time": "2024-11-30 10:00:00",
      "settle_time": "2024-11-30 10:05:00"
    }
  ]
}
```

### 10.5 佣金明细
```
GET /api/agent/commission?start_date=&end_date=&account=&type=
```

**响应**:
```json
{
  "list": [
    {
      "date": "2024-11-01",
      "target_account": "agent002",
      "target_type": "agent",
      "valid_bet": 100000,
      "win_loss": -10000,
      "wash_code_rate": 0.02,
      "wash_code_fee": 2000,
      "share_ratio": 0.30,
      "commission_amount": 2400
    }
  ],
  "summary": {
    "total_commission": 50000,
    "month_commission": 10000,
    "today_commission": 500
  }
}
```

### 10.6 财务记录
```
GET /api/agent/transactions?page=1&limit=20&type=
```

**查询参数**:
- `type`: 交易类型（commission/transfer_in/transfer_out/bonus/adjust）

---

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/登录过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

**错误响应格式**:
```json
{
  "error": "错误信息"
}
```

---

## 通用参数

### 分页参数
- `page`: 页码（从1开始）
- `limit`: 每页数量（默认20，最大100）

### 日期格式
- 日期: `YYYY-MM-DD`
- 日期时间: `YYYY-MM-DD HH:mm:ss`

### 状态码
- 玩家状态: `active` (启用), `disabled` (禁用)
- 代理状态: `active` (启用), `disabled` (禁用)
- 交易状态: `pending` (待处理), `approved` (已通过), `rejected` (已拒绝), `completed` (已完成)
- 洗码状态: `0` (待发放), `1` (已发放), `2` (已拒绝)

---

## 更新日志

### V2.1 (2024-11-30)
- ✅ 新增 `/api/agent/player-game-detail` 玩家游戏详情接口
- ✅ 优化报表数据字段命名
- ✅ 统一「洗码费」术语

### V2.0 (2024-11-01)
- 初始版本发布

---

© 2024 真人荷官视讯系统 API文档
