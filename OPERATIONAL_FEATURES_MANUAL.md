# 运营级管理后台 - 核心功能详解手册

> **文档类型**：功能详解手册  
> **适用对象**：产品经理、技术团队、运营团队  
> **更新日期**：2025-12-13  
> **版本号**：V1.0

---

## 📋 目录

### 一、效率类功能（让操作"更快"）
- [1.1 高级批量操作](#11-高级批量操作)
  - [1.1.1 批量状态变更](#111-批量状态变更)
  - [1.1.2 批量审核](#112-批量审核)
  - [1.1.3 批量导入/导出](#113-批量导入导出)
- [1.2 超级筛选与搜索](#12-超级筛选与搜索)
  - [1.2.1 复合条件查询](#121-复合条件查询)
  - [1.2.2 快捷预览](#122-快捷预览)
  - [1.2.3 智能推荐筛选](#123-智能推荐筛选)
- [1.3 模拟与预览](#13-模拟与预览)
  - [1.3.1 操作预览](#131-操作预览)
  - [1.3.2 批量预验证](#132-批量预验证)

### 二、流程与控制类（让操作"更稳"）
- [2.1 审核流工作台](#21-审核流工作台)
  - [2.1.1 统一审核队列](#211-统一审核队列)
  - [2.1.2 审核优先级控制](#212-审核优先级控制)
  - [2.1.3 审核规则引擎](#213-审核规则引擎)
- [2.2 灵活配置中心](#22-灵活配置中心)
  - [2.2.1 系统参数配置](#221-系统参数配置)
  - [2.2.2 文本配置](#222-文本配置)
  - [2.2.3 功能开关](#223-功能开关)
  - [2.2.4 维护模式](#224-维护模式)
- [2.3 推送与触达](#23-推送与触达)
  - [2.3.1 异常自动推送](#231-异常自动推送)
  - [2.3.2 审核提醒](#232-审核提醒)

### 三、安全与风控类（让操作"更稳"）
- [3.1 操作日志](#31-操作日志)
  - [3.1.1 完整操作日志](#311-完整操作日志)
  - [3.1.2 操作日志界面](#312-操作日志界面)
  - [3.1.3 详细操作记录](#313-详细操作记录)
  - [3.1.4 数据变更对比](#314-数据变更对比)
  - [3.1.5 日志查询界面](#315-日志查询界面)
- [3.2 敏感操作保护](#32-敏感操作保护)
  - [3.2.1 二次确认](#321-二次确认)
  - [3.2.2 审批流程](#322-审批流程)
- [3.3 细粒度权限控制](#33-细粒度权限控制)
  - [3.3.1 功能级权限](#331-功能级权限)
  - [3.3.2 数据级权限](#332-数据级权限)

### 四、真人视讯垂直功能
- [4.1 现场与局务管理](#41-现场与局务管理)
  - [4.1.1 改单/重结算系统](#411-改单重结算系统)
  - [4.1.2 作废局](#412-作废局)
  - [4.1.3 手工补单](#413-手工补单)
  - [4.1.4 局级视频回放](#414-局级视频回放)
- [4.2 风险控制与监控](#42-风险控制与监控)
  - [4.2.1 套利/洗码检测](#421-套利洗码检测)
  - [4.2.2 同IP多账号告警](#422-同ip多账号告警)
  - [4.2.3 机器人检测](#423-机器人检测)
- [4.3 互动与内容生态](#43-互动与内容生态)
  - [4.3.1 聊天审核](#431-聊天审核)
  - [4.3.2 玩家举报处理](#432-玩家举报处理)
- [4.4 财务与核算](#44-财务与核算)
  - [4.4.1 实时对账](#441-实时对账)
  - [4.4.2 异常账务处理](#442-异常账务处理)

---

## 一、效率类功能（让操作"更快"）

### 1.1 高级批量操作

#### 1.1.1 批量状态变更
**功能编号**: EFF-1.1.1  
**优先级**: 🔴 P0

**痛点**
- 修改100个玩家状态需要重复点击100次
- 批量禁用/启用代理耗时超过30分钟
- 无法快速响应批量违规账号处理需求

**功能设计**
```
用户管理 → 玩家列表 → 批量操作

1. 多选框选择目标玩家（支持全选/反选）
2. 批量操作下拉菜单：
   - 启用账号
   - 禁用账号
   - 冻结账号
   - 设置VIP等级
   - 添加标签
3. 确认对话框显示影响数量
4. 后台异步处理 + 进度反馈
```

**技术实现**
```javascript
// API 设计
POST /api/players/batch-update
{
  "player_ids": [101, 102, 103],
  "action": "disable", // enable/disable/freeze
  "reason": "违规行为",
  "operator_id": 1001
}

// 响应
{
  "success": true,
  "affected_count": 3,
  "failed_ids": [],
  "task_id": "batch_task_12345" // 用于查询进度
}
```

**预期收益**
- ✅ 批量操作效率提升 **90%**
- ✅ 从30分钟缩短至 **2分钟**
- ✅ 减少人工失误率

---

#### 1.1.2 批量审核
**功能编号**: EFF-1.1.2  
**优先级**: 🔴 P0

**痛点**
- 每日提现申请50-100单，逐个审核耗时2-3小时
- 优惠券审核积压，高峰期延迟严重
- 审核员需要反复切换页面，体验差

**功能设计**
```
财务管理 → 提现审核 → 批量审核

【快捷筛选】
- 金额范围：100-1000元
- 用户等级：VIP3及以上
- 自动风控：已通过

【批量操作面板】
1. 一键全选（当前页/全部符合条件）
2. 批量通过（支持备注）
3. 批量拒绝（必填拒绝原因）
4. 分组审核（按金额/等级分组）

【安全机制】
- 单次批量上限：50单
- 高额提现（>5000元）强制单独审核
- 二次确认弹窗
```

**技术实现**
```javascript
// 批量审核 API
POST /api/withdrawals/batch-approve
{
  "withdrawal_ids": [1001, 1002, 1003],
  "action": "approve", // approve/reject
  "reason": "正常审核通过",
  "operator_id": 1001
}

// 数据库更新
UPDATE withdrawals 
SET status = 'approved',
    approved_by = 1001,
    approved_at = NOW(),
    approve_reason = '正常审核通过'
WHERE id IN (1001, 1002, 1003)
  AND status = 'pending'
```

**预期收益**
- ✅ 审核效率提升 **80%**
- ✅ 单次审核时间从 **2小时** 降至 **20分钟**
- ✅ 用户提现到账时效提升50%

---

#### 1.1.3 批量导入/导出
**功能编号**: EFF-1.1.3  
**优先级**: 🟡 P1

**痛点**
- 新增100个测试账号需要手动录入
- 导出数据格式不统一，二次处理成本高
- 缺少导入错误预检，上传后才发现问题

**功能设计**
```
系统管理 → 批量操作

【批量导入】
1. 下载Excel模板
2. 上传Excel文件
3. 错误预检（格式/数据校验）
4. 预览导入结果（显示成功/失败条目）
5. 确认导入

【批量导出】
1. 自定义导出字段
2. 选择导出格式（Excel/CSV）
3. 异步生成文件（大数据量场景）
4. 下载链接（保留24小时）
```

**技术实现**
```javascript
// 导入预检 API
POST /api/players/import-preview
Content-Type: multipart/form-data
{
  "file": <Excel文件>
}

// 响应
{
  "total": 100,
  "valid": 95,
  "invalid": 5,
  "errors": [
    {
      "row": 12,
      "field": "email",
      "message": "邮箱格式错误"
    }
  ],
  "preview_data": [...]
}
```

**预期收益**
- ✅ 批量数据操作效率提升 **95%**
- ✅ 减少导入错误率至 **<1%**
- ✅ 数据迁移成本降低 **70%**

---

### 1.2 超级筛选与搜索

#### 1.2.1 复合条件查询
**功能编号**: EFF-1.2.1  
**优先级**: 🟡 P1

**痛点**
- 筛选条件单一，无法组合查询
- 查找"近7天充值>1000元且未提现的VIP用户"需要多步操作
- 缺少历史筛选条件保存功能

**功能设计**
```
【高级筛选器】
1. 支持多字段组合（AND/OR逻辑）
2. 条件组嵌套（支持括号逻辑）
3. 保存常用筛选条件
4. 快捷筛选标签

示例：
(充值金额 > 1000 AND 注册天数 > 30)
OR
(VIP等级 >= 3 AND 近7天活跃)
```

**技术实现**
```javascript
// 复合查询 API
POST /api/players/advanced-search
{
  "filters": [
    {
      "group": "A",
      "field": "total_deposit",
      "operator": ">",
      "value": 1000
    },
    {
      "group": "A",
      "field": "register_days",
      "operator": ">",
      "value": 30
    },
    {
      "group": "B",
      "field": "vip_level",
      "operator": ">=",
      "value": 3
    }
  ],
  "logic": "(A) OR (B)"
}
```

**预期收益**
- ✅ 查询准确度提升 **60%**
- ✅ 减少无效筛选操作 **70%**
- ✅ 提升精准营销效率

---

#### 1.2.2 快捷预览
**功能编号**: EFF-1.2.2  
**优先级**: 🟢 P2

**痛点**
- 查看玩家详情需要跳转新页面
- 来回切换导致工作流中断
- 无法快速对比多个记录

**功能设计**
```
列表页 → 鼠标悬停 / 点击快速预览按钮

【预览面板】
- 侧边栏弹出（不跳转页面）
- 显示核心信息（用户信息/财务数据/最近活动）
- 支持快捷操作（禁用/备注/发送消息）
- 键盘快捷键（Esc关闭，方向键切换）
```

**预期收益**
- ✅ 信息查看效率提升 **50%**
- ✅ 减少页面跳转次数 **80%**
- ✅ 提升操作流畅度

---

#### 1.2.3 智能推荐筛选
**功能编号**: EFF-1.2.3  
**优先级**: 🟢 P2

**痛点**
- 新员工不熟悉常用筛选逻辑
- 高价值用户筛选标准不统一
- 无法快速找到异常账号

**功能设计**
```
【智能推荐】
系统根据历史操作推荐常用筛选：

1. 高价值客户（充值>10000 + 活跃>30天）
2. 流失预警（7天未登录 + 历史充值>1000）
3. 异常账号（单日登录IP>5个）
4. 优质代理（下级玩家>50人 + 月佣金>5000）
```

**预期收益**
- ✅ 新员工上手速度提升 **60%**
- ✅ 减少培训成本
- ✅ 标准化运营流程

---

### 1.3 模拟与预览

#### 1.3.1 操作预览
**功能编号**: EFF-1.3.1  
**优先级**: 🟡 P1

**痛点**
- 批量操作前无法预知影响范围
- 误操作导致数据错误
- 缺少回滚机制

**功能设计**
```
批量操作 → 预览影响

【预览界面】
1. 显示将受影响的记录列表
2. 高亮显示关键变更字段
3. 风险提示（如影响VIP用户）
4. 预计执行时间
5. 二次确认按钮
```

**技术实现**
```javascript
// 操作预览 API
POST /api/preview/batch-update
{
  "player_ids": [101, 102, 103],
  "action": "disable"
}

// 响应
{
  "affected_count": 3,
  "records": [
    {
      "id": 101,
      "name": "张三",
      "current_status": "active",
      "new_status": "disabled",
      "risk_level": "medium", // VIP用户
      "warnings": ["该用户为VIP3用户"]
    }
  ],
  "estimated_time": "2秒"
}
```

**预期收益**
- ✅ 减少误操作率 **95%**
- ✅ 提升操作信心
- ✅ 降低数据修复成本

---

#### 1.3.2 批量预验证
**功能编号**: EFF-1.3.2  
**优先级**: 🟡 P1

**痛点**
- Excel导入后才发现数据错误
- 重复邮箱/手机号导致导入失败
- 缺少业务规则校验

**功能设计**
```
批量导入 → 上传文件 → 预验证

【验证规则】
1. 格式校验（邮箱/手机号/身份证）
2. 重复性校验（邮箱/用户名唯一性）
3. 业务规则校验（VIP等级范围/余额上限）
4. 关联数据校验（代理ID是否存在）

【结果展示】
- 总记录数：100条
- 通过验证：95条
- 失败记录：5条（标红显示错误原因）
- 支持导出错误报告
```

**预期收益**
- ✅ 导入成功率提升至 **>99%**
- ✅ 减少返工时间 **80%**
- ✅ 提升数据质量

---

## 二、流程与控制类（让操作"更稳"）

### 2.1 审核流工作台

#### 2.1.1 统一审核队列
**功能编号**: CTL-2.1.1  
**优先级**: 🔴 P0

**痛点**
- 提现审核、优惠券审核、用户资料审核分散在不同页面
- 审核员需要切换多个模块，效率低
- 无法统一管理待审核任务

**功能设计**
```
工作台 → 我的待审核

【统一队列】
1. 提现申请（50单）
2. 优惠券领取（20单）
3. 用户资料修改（15单）
4. 代理申请（5单）

【筛选与排序】
- 按类型筛选
- 按优先级排序（金额/VIP等级）
- 按等待时长排序
- 我的待办/全部待办切换
```

**技术实现**
```javascript
// 统一审核队列 API
GET /api/audit/pending-tasks
{
  "page": 1,
  "limit": 20,
  "task_type": "all", // withdrawal/bonus/profile/agent
  "sort_by": "priority" // priority/waiting_time/amount
}

// 响应
{
  "total": 90,
  "tasks": [
    {
      "id": 1001,
      "type": "withdrawal",
      "player_name": "张三",
      "amount": 5000,
      "priority": "high",
      "waiting_time": "2小时30分",
      "link": "/withdrawals/1001"
    }
  ]
}
```

**预期收益**
- ✅ 审核效率提升 **40%**
- ✅ 任务遗漏率降至 **0%**
- ✅ 提升审核员工作体验

---

#### 2.1.2 审核优先级控制
**功能编号**: CTL-2.1.2  
**优先级**: 🟡 P1

**痛点**
- VIP大额提现被普通小额提现淹没
- 紧急审核无法快速定位
- 缺少自动化优先级规则

**功能设计**
```
【优先级规则】
🔴 高优先级（立即处理）
- 提现金额 > 10000元
- VIP等级 >= 5
- 等待时长 > 2小时

🟡 中优先级（1小时内处理）
- 提现金额 1000-10000元
- VIP等级 3-4

🟢 低优先级（正常处理）
- 提现金额 < 1000元
- 普通用户
```

**技术实现**
```javascript
// 优先级计算逻辑
function calculatePriority(task) {
  let priority = 0;
  
  // 金额权重
  if (task.amount > 10000) priority += 50;
  else if (task.amount > 1000) priority += 20;
  
  // VIP权重
  priority += task.vip_level * 5;
  
  // 等待时长权重
  const waitingHours = task.waiting_time / 3600;
  priority += waitingHours * 10;
  
  return priority;
}
```

**预期收益**
- ✅ 高价值用户满意度提升 **50%**
- ✅ 减少VIP用户投诉 **70%**
- ✅ 优化审核资源分配

---

#### 2.1.3 审核规则引擎
**功能编号**: CTL-2.1.3  
**优先级**: 🟢 P2

**痛点**
- 简单审核需要人工介入
- 审核标准不统一
- 无法自动拦截高风险申请

**功能设计**
```
系统设置 → 审核规则

【自动审核规则】
1. 提现金额 < 1000元 + 账户正常 → 自动通过
2. 单日提现次数 > 5次 → 自动拦截
3. IP异常 + 大额提现 → 转人工审核

【规则配置界面】
- 条件设置（金额/频率/风控分数）
- 动作设置（自动通过/拒绝/转人工）
- 规则优先级排序
- 启用/禁用开关
```

**技术实现**
```javascript
// 规则引擎配置
const auditRules = [
  {
    id: 1,
    name: "小额自动通过",
    conditions: {
      amount: { operator: "<", value: 1000 },
      risk_score: { operator: "<", value: 50 }
    },
    action: "auto_approve",
    priority: 1,
    enabled: true
  },
  {
    id: 2,
    name: "高频拦截",
    conditions: {
      daily_withdrawal_count: { operator: ">", value: 5 }
    },
    action: "auto_reject",
    priority: 2,
    enabled: true
  }
];
```

**预期收益**
- ✅ 人工审核量降低 **60%**
- ✅ 审核一致性提升 **90%**
- ✅ 风险拦截准确率 **>95%**

---

### 2.2 灵活配置中心

#### 2.2.1 系统参数配置
**功能编号**: CTL-2.2.1  
**优先级**: 🔴 P0

**痛点**
- 业务参数硬编码在代码中
- 修改配置需要重新发布
- 无法快速响应业务调整

**功能设计**
```
系统设置 → 参数配置

【核心参数】
1. 提现限额（单笔/每日/每月）
2. 优惠券规则（领取上限/使用条件）
3. VIP升级门槛
4. 代理佣金比例
5. 风控阈值

【配置界面】
- 分类管理（财务/营销/风控）
- 实时生效（无需重启）
- 修改历史记录
- 配置回滚功能
```

**技术实现**
```javascript
// 参数配置表结构
CREATE TABLE system_configs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  config_key VARCHAR(100) UNIQUE,
  config_value TEXT,
  config_type VARCHAR(50), // string/number/json
  category VARCHAR(50), // finance/marketing/risk
  description TEXT,
  updated_by INT,
  updated_at TIMESTAMP
);

// 配置读取 API
GET /api/configs/:key
{
  "key": "max_daily_withdrawal",
  "value": 50000,
  "type": "number",
  "description": "每日提现上限"
}
```

**预期收益**
- ✅ 配置调整响应时间从 **1天** 降至 **1分钟**
- ✅ 减少代码发布频率 **50%**
- ✅ 提升业务灵活性

---

#### 2.2.2 文本配置
**功能编号**: CTL-2.2.2  
**优先级**: 🟡 P1

**痛点**
- 提示文案、错误信息硬编码
- 多语言支持成本高
- 运营活动文案修改需要开发介入

**功能设计**
```
系统设置 → 文本配置

【文本类型】
1. 系统提示（登录/注册/操作成功）
2. 错误信息（余额不足/账号冻结）
3. 营销文案（活动通知/优惠券说明）
4. 多语言支持

【配置界面】
- 文本键值对管理
- 支持富文本编辑
- 变量占位符（{username}、{amount}）
- 预览功能
```

**技术实现**
```javascript
// 文本配置表
CREATE TABLE text_configs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text_key VARCHAR(100) UNIQUE,
  language VARCHAR(10), // zh-CN/en-US
  text_value TEXT,
  variables JSON, // ["username", "amount"]
  category VARCHAR(50),
  updated_at TIMESTAMP
);

// 使用示例
const message = getText('withdrawal_success', {
  username: '张三',
  amount: 1000
});
// 输出：恭喜 张三，您的提现申请（1000元）已通过审核！
```

**预期收益**
- ✅ 文案修改响应时间从 **1天** 降至 **实时**
- ✅ 多语言支持成本降低 **80%**
- ✅ 提升运营自主性

---

#### 2.2.3 功能开关
**功能编号**: CTL-2.2.3  
**优先级**: 🔴 P0

**痛点**
- 新功能上线风险高，无法快速回滚
- 紧急情况无法快速关闭问题功能
- 灰度发布能力缺失

**功能设计**
```
系统设置 → 功能开关

【开关列表】
1. 充值功能（全局/分渠道）
2. 提现功能（全局/分用户等级）
3. 优惠券领取
4. 聊天功能
5. 第三方游戏接入

【高级功能】
- 灰度发布（百分比/用户ID白名单）
- 定时开关（活动开始/结束自动切换）
- 开关联动（关闭充值时自动关闭提现）
```

**技术实现**
```javascript
// 功能开关表
CREATE TABLE feature_toggles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feature_key VARCHAR(100) UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INT DEFAULT 0, // 0-100
  whitelist JSON, // 用户ID白名单
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  updated_by INT,
  updated_at TIMESTAMP
);

// 前端调用
const canWithdraw = await checkFeature('withdrawal', user_id);
if (!canWithdraw) {
  showMessage('提现功能暂时关闭，请稍后再试');
}
```

**预期收益**
- ✅ 紧急故障响应时间从 **30分钟** 降至 **秒级**
- ✅ 新功能上线风险降低 **70%**
- ✅ 支持灰度发布策略

---

#### 2.2.4 维护模式
**功能编号**: CTL-2.2.4  
**优先级**: 🔴 P0

**痛点**
- 系统维护时用户仍可操作
- 无法优雅地通知用户维护时间
- 维护期间数据不一致风险

**功能设计**
```
系统设置 → 维护模式

【维护配置】
1. 维护时间段设置
2. 维护公告自定义
3. 白名单设置（管理员/测试账号可访问）
4. 维护倒计时提醒

【前端展示】
- 全屏维护公告页面
- 预计恢复时间
- 客服联系方式
```

**技术实现**
```javascript
// 维护模式配置
const maintenanceConfig = {
  enabled: true,
  start_time: '2025-12-15 02:00:00',
  end_time: '2025-12-15 04:00:00',
  notice: '系统正在升级维护中，预计2小时后恢复，给您带来不便敬请谅解！',
  whitelist: [1001, 1002] // 管理员ID
};

// 中间件拦截
app.use(async (req, res, next) => {
  const maintenance = await getMaintenanceConfig();
  if (maintenance.enabled && !isWhitelisted(req.user_id)) {
    return res.status(503).json({
      message: maintenance.notice,
      end_time: maintenance.end_time
    });
  }
  next();
});
```

**预期收益**
- ✅ 维护期间数据一致性保障 **100%**
- ✅ 减少用户投诉 **80%**
- ✅ 提升系统维护专业性

---

### 2.3 推送与触达

#### 2.3.1 异常自动推送
**功能编号**: CTL-2.3.1  
**优先级**: 🟡 P1

**痛点**
- 系统异常需要人工巡检才能发现
- 关键指标异常无法及时响应
- 缺少自动化告警机制

**功能设计**
```
系统设置 → 异常推送规则

【推送场景】
1. 大额提现（>10000元）
2. 单用户单日充值异常（>50000元）
3. 系统错误率突增（>1%）
4. 数据库连接异常
5. 第三方支付异常

【推送渠道】
- 站内消息
- 邮件通知
- 企业微信/钉钉机器人
- 短信告警（紧急情况）
```

**技术实现**
```javascript
// 异常监控规则
const alertRules = [
  {
    id: 1,
    name: "大额提现告警",
    condition: "withdrawal.amount > 10000",
    channels: ["wechat", "email"],
    recipients: ["risk_team"],
    cooldown: 300 // 5分钟内不重复推送
  }
];

// 推送示例
async function sendAlert(rule, data) {
  const message = `⚠️ 异常告警：${rule.name}\n用户：${data.username}\n金额：${data.amount}元\n时间：${data.created_at}`;
  
  await sendToWechat(message);
  await sendToEmail(rule.recipients, message);
}
```

**预期收益**
- ✅ 异常发现时间从 **小时级** 降至 **分钟级**
- ✅ 减少损失金额 **60%**
- ✅ 提升风控响应速度

---

#### 2.3.2 审核提醒
**功能编号**: CTL-2.3.2  
**优先级**: 🟢 P2

**痛点**
- 审核员无法及时知道待审核任务
- 高优先级任务积压
- 审核超时无提醒

**功能设计**
```
【提醒规则】
1. 新任务到达（实时推送）
2. 高优先级任务（5分钟内提醒）
3. 审核超时（等待>2小时提醒）
4. 每日待审核汇总（早上9点推送）

【推送方式】
- 站内消息（红点提示）
- 浏览器桌面通知
- 邮件汇总
```

**预期收益**
- ✅ 审核响应速度提升 **50%**
- ✅ 任务超时率降至 **<5%**
- ✅ 提升审核员工作效率

---

## 三、安全与风控类（让操作"更稳"）

### 3.1 操作日志

#### 3.1.1 完整操作日志
**功能编号**: SEC-3.1.1  
**优先级**: 🔴 P0

**痛点**
- 无法追溯谁修改了用户数据
- 数据纠纷无法提供证据
- 内部人员违规操作无法追责

**功能设计**
```
【日志记录范围】
1. 用户操作（登录/注册/资料修改）
2. 财务操作（充值/提现/转账）
3. 管理员操作（审核/修改/删除）
4. 系统操作（定时任务/自动审核）

【日志内容】
- 操作人（user_id/admin_id/system）
- 操作时间（精确到秒）
- 操作类型（create/update/delete）
- 操作对象（表名/记录ID）
- 操作前数据（JSON）
- 操作后数据（JSON）
- 操作IP/设备信息
```

**技术实现**
```javascript
// 操作日志表
CREATE TABLE operation_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  operator_type VARCHAR(20), // user/admin/system
  operator_id INT,
  operation VARCHAR(50), // create/update/delete
  target_table VARCHAR(100),
  target_id INT,
  before_data JSON,
  after_data JSON,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP,
  INDEX idx_operator (operator_type, operator_id),
  INDEX idx_target (target_table, target_id),
  INDEX idx_created_at (created_at)
);

// 记录日志示例
await logOperation({
  operator_type: 'admin',
  operator_id: 1001,
  operation: 'update',
  target_table: 'players',
  target_id: 12345,
  before_data: { status: 'active', balance: 1000 },
  after_data: { status: 'disabled', balance: 1000 },
  ip_address: req.ip,
  user_agent: req.headers['user-agent']
});
```

**预期收益**
- ✅ 数据追溯能力 **100%覆盖**
- ✅ 减少内部纠纷 **90%**
- ✅ 满足合规审计要求

---

#### 3.1.2 操作日志界面
**功能编号**: SEC-3.1.2  
**优先级**: 🔴 P0

**痛点**
- 日志记录了但无法查询
- 查询操作记录需要直接查数据库
- 缺少可视化日志分析工具

**功能设计**
```
系统管理 → 操作日志

【查询条件】
1. 操作人（管理员/用户）
2. 操作类型（新增/修改/删除）
3. 目标对象（表名/记录ID）
4. 时间范围
5. IP地址

【展示内容】
- 列表显示（操作人/时间/类型/对象）
- 详情弹窗（完整日志信息）
- 数据对比（修改前后差异高亮）
- 导出功能（Excel/CSV）
```

**技术实现**
```javascript
// 日志查询 API
GET /api/logs/operations
{
  "operator_id": 1001,
  "operation": "update",
  "target_table": "players",
  "start_date": "2025-12-01",
  "end_date": "2025-12-13",
  "page": 1,
  "limit": 20
}

// 响应
{
  "total": 150,
  "logs": [
    {
      "id": 12345,
      "operator_name": "张三",
      "operation": "update",
      "target": "玩家 #12345",
      "summary": "修改玩家状态：active → disabled",
      "created_at": "2025-12-13 10:30:15"
    }
  ]
}
```

**预期收益**
- ✅ 日志查询效率提升 **90%**（从30分钟降至2分钟）
- ✅ 提升问题排查速度
- ✅ 增强数据透明度

---

#### 3.1.3 详细操作记录
**功能编号**: SEC-3.1.3  
**优先级**: 🟡 P1

**痛点**
- 日志记录不够详细
- 无法还原完整操作场景
- 缺少关联操作追溯

**功能设计**
```
【增强日志内容】
1. 操作原因/备注
2. 关联操作链（批量操作时记录批次ID）
3. 操作入口（API路径/页面URL）
4. 操作结果（成功/失败/部分成功）
5. 审批流程（如需审批，记录审批链）

【关联查询】
- 查看某用户的所有操作记录
- 查看某条记录的所有修改历史
- 查看某批次的所有操作记录
```

**技术实现**
```javascript
// 增强日志记录
await logOperation({
  operator_id: 1001,
  operation: 'batch_update',
  batch_id: 'batch_20251213_001',
  target_table: 'players',
  affected_count: 50,
  reason: '批量禁用违规账号',
  entry_url: '/admin/players/batch-disable',
  result: 'success',
  details: {
    success_ids: [101, 102, 103],
    failed_ids: []
  }
});
```

**预期收益**
- ✅ 问题定位准确度提升 **80%**
- ✅ 减少重复排查时间
- ✅ 提升日志价值

---

#### 3.1.4 数据变更对比
**功能编号**: SEC-3.1.4  
**优先级**: 🟡 P1

**痛点**
- 修改记录无法直观对比
- 查看数据变化需要对比JSON
- 缺少可视化差异展示

**功能设计**
```
操作日志详情 → 数据对比

【对比展示】
| 字段名 | 修改前 | 修改后 |
|--------|--------|--------|
| 状态   | 🟢 active | 🔴 disabled |
| 余额   | 1000.00 | 1000.00 |
| VIP等级 | 3 | 5 ⬆️ |

【高级功能】
- 仅显示变更字段
- 高亮显示差异
- 支持JSON对比（嵌套数据）
```

**技术实现**
```javascript
// 数据对比函数
function compareData(before, after) {
  const changes = [];
  
  for (const key in after) {
    if (before[key] !== after[key]) {
      changes.push({
        field: key,
        before: before[key],
        after: after[key],
        change_type: after[key] > before[key] ? 'increase' : 'decrease'
      });
    }
  }
  
  return changes;
}
```

**预期收益**
- ✅ 数据审核效率提升 **70%**
- ✅ 减少人工对比错误
- ✅ 提升日志可读性

---

#### 3.1.5 日志查询界面
**功能编号**: SEC-3.1.5  
**优先级**: 🟡 P1

**痛点**
- 海量日志查询缓慢
- 缺少高级筛选功能
- 无法快速定位关键日志

**功能设计**
```
【高级查询】
1. 全文搜索（支持关键词）
2. 多条件组合查询
3. 快捷时间范围（今天/本周/本月）
4. 操作类型快捷筛选
5. 收藏常用查询条件

【性能优化】
- 分页加载（默认20条/页）
- 索引优化（操作人/时间/目标）
- 查询结果缓存
```

**技术实现**
```sql
-- 日志表索引优化
CREATE INDEX idx_logs_operator ON operation_logs(operator_type, operator_id);
CREATE INDEX idx_logs_time ON operation_logs(created_at);
CREATE INDEX idx_logs_target ON operation_logs(target_table, target_id);

-- 复合索引
CREATE INDEX idx_logs_query ON operation_logs(
  operator_id, 
  target_table, 
  created_at
);
```

**预期收益**
- ✅ 日志查询速度提升 **10倍**（从10秒降至1秒）
- ✅ 支持海量日志（>1000万条）
- ✅ 提升用户体验

---

### 3.2 敏感操作保护

#### 3.2.1 二次确认
**功能编号**: SEC-3.2.1  
**优先级**: 🔴 P0

**痛点**
- 误操作导致数据丢失
- 批量删除无确认机制
- 关键操作门槛过低

**功能设计**
```
【需要二次确认的操作】
1. 批量删除/禁用
2. 修改系统配置
3. 大额财务操作
4. 权限变更
5. 数据导出

【确认方式】
- 弹窗确认（显示影响范围）
- 输入验证码
- 输入特定文字确认（如"确认删除"）
- 短信验证（高危操作）
```

**技术实现**
```javascript
// 前端二次确认
async function confirmDangerousOperation() {
  const confirmed = await showConfirmDialog({
    title: '⚠️ 危险操作确认',
    message: '您即将批量禁用 50 个用户账号，此操作不可撤销！',
    confirmText: '确认执行',
    cancelText: '取消',
    requireInput: true,
    inputPlaceholder: '请输入"确认禁用"以继续'
  });
  
  if (confirmed && confirmed.input === '确认禁用') {
    await executeBatchDisable();
  }
}
```

**预期收益**
- ✅ 误操作率降低 **95%**
- ✅ 数据安全性提升
- ✅ 减少数据恢复成本

---

#### 3.2.2 审批流程
**功能编号**: SEC-3.2.2  
**优先级**: 🟡 P1

**痛点**
- 敏感操作权限过大
- 缺少审批机制
- 无法实现双人复核

**功能设计**
```
【审批流程】
1. 发起申请（填写原因/预期影响）
2. 审批人审核（同意/拒绝/转交）
3. 执行操作（审批通过后自动执行）
4. 结果通知

【审批场景】
- 大额人工调账（>10000元）
- 批量修改VIP等级
- 系统参数重大调整
- 权限提升申请
```

**技术实现**
```javascript
// 审批流程表
CREATE TABLE approval_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requester_id INT,
  operation_type VARCHAR(50),
  operation_data JSON,
  reason TEXT,
  approver_id INT,
  status VARCHAR(20), // pending/approved/rejected
  approved_at TIMESTAMP,
  executed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

// 提交审批
await createApprovalRequest({
  requester_id: 1001,
  operation_type: 'manual_adjust_balance',
  operation_data: {
    player_id: 12345,
    amount: 50000,
    reason: '补偿用户'
  },
  reason: '系统故障导致用户损失，需要补偿'
});
```

**预期收益**
- ✅ 敏感操作风险降低 **80%**
- ✅ 实现责任分离机制
- ✅ 提升合规性

---

### 3.3 细粒度权限控制

#### 3.3.1 功能级权限
**功能编号**: SEC-3.3.1  
**优先级**: 🔴 P0

**痛点**
- 权限控制粗糙（只有"管理员"和"普通用户"）
- 无法实现精细化权限分配
- 不同岗位无法隔离权限

**功能设计**
```
系统管理 → 角色权限

【角色定义】
1. 超级管理员（全部权限）
2. 财务审核员（仅审核权限）
3. 客服专员（仅查看+备注）
4. 运营人员（查看+配置）
5. 风控专员（查看+风控操作）

【权限粒度】
- 模块权限（用户管理/财务管理/系统设置）
- 功能权限（查看/新增/修改/删除/审核）
- 页面权限（隐藏无权限的菜单/按钮）
```

**技术实现**
```javascript
// 角色权限表
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  permissions JSON, // ["user.view", "user.edit", "finance.approve"]
  description TEXT
);

// 权限检查中间件
async function checkPermission(req, res, next) {
  const userRole = await getUserRole(req.user_id);
  const requiredPermission = req.route.permission;
  
  if (!userRole.permissions.includes(requiredPermission)) {
    return res.status(403).json({ message: '无权限访问' });
  }
  
  next();
}

// 路由定义
app.get('/api/players', 
  checkPermission, 
  { permission: 'player.view' },
  getPlayers
);
```

**预期收益**
- ✅ 权限管理精细度提升 **10倍**
- ✅ 减少权限滥用风险 **90%**
- ✅ 满足合规审计要求

---

#### 3.3.2 数据级权限
**功能编号**: SEC-3.3.2  
**优先级**: 🟡 P1

**痛点**
- 所有管理员可查看全部数据
- 无法实现数据隔离
- 多品牌/多区域无法独立管理

**功能设计**
```
【数据权限维度】
1. 按品牌隔离（品牌A管理员只能看品牌A数据）
2. 按区域隔离（亚洲区管理员只能看亚洲数据）
3. 按代理线隔离（代理管理员只能看自己线下数据）
4. 按金额隔离（客服只能处理<1000元的提现）

【实现方式】
- SQL查询自动添加过滤条件
- API返回数据自动过滤
- 前端隐藏无权限数据
```

**技术实现**
```javascript
// 数据权限配置
const dataPermissions = {
  role_id: 2001, // 品牌A管理员
  filters: {
    brand_id: 1,
    region: 'asia'
  }
};

// 自动添加数据权限过滤
function applyDataPermission(query, user) {
  const permissions = getUserDataPermissions(user.role_id);
  
  if (permissions.filters.brand_id) {
    query.where('brand_id', permissions.filters.brand_id);
  }
  
  if (permissions.filters.region) {
    query.where('region', permissions.filters.region);
  }
  
  return query;
}

// 使用示例
let query = db('players').select('*');
query = applyDataPermission(query, req.user);
const players = await query;
```

**预期收益**
- ✅ 数据安全性提升 **90%**
- ✅ 支持多品牌/多区域管理
- ✅ 减少数据泄露风险

---

## 四、真人视讯垂直功能

### 4.1 现场与局务管理

#### 4.1.1 改单/重结算系统
**功能编号**: LIVE-4.1.1  
**优先级**: 🔴 P0

**痛点**
- 游戏结果错误无法修正
- 手动修改数据库风险高
- 缺少完整的改单流程和审计

**功能设计**
```
真人视讯 → 局务管理 → 改单申请

【流程】
1. 风控/客服发起改单申请
2. 填写改单原因（荷官误判/技术故障）
3. 上传证据（视频截图/聊天记录）
4. 主管审批
5. 系统自动重新结算
6. 通知相关玩家

【改单类型】
- 修改游戏结果（赢→输 / 输→赢）
- 作废游戏局（退还所有投注）
- 调整赔率（错误赔率纠正）
```

**技术实现**
```javascript
// 改单申请表
CREATE TABLE game_amendments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  game_round_id BIGINT,
  original_result JSON,
  new_result JSON,
  reason TEXT,
  evidence_urls JSON,
  requester_id INT,
  approver_id INT,
  status VARCHAR(20), // pending/approved/rejected/executed
  executed_at TIMESTAMP,
  created_at TIMESTAMP
);

// 重结算逻辑
async function recalculateGameRound(amendment) {
  // 1. 回滚原结算
  await rollbackOriginalBets(amendment.game_round_id);
  
  // 2. 更新游戏结果
  await updateGameResult(amendment.game_round_id, amendment.new_result);
  
  // 3. 重新结算所有投注
  const bets = await getBetsByRound(amendment.game_round_id);
  for (const bet of bets) {
    const payout = calculatePayout(bet, amendment.new_result);
    await updateBetResult(bet.id, payout);
    await adjustPlayerBalance(bet.player_id, payout);
  }
  
  // 4. 记录操作日志
  await logAmendment(amendment);
  
  // 5. 通知玩家
  await notifyAffectedPlayers(bets);
}
```

**预期收益**
- ✅ 游戏公平性保障 **100%**
- ✅ 改单处理时间从 **2小时** 降至 **10分钟**
- ✅ 减少客户投诉 **80%**

---

#### 4.1.2 作废局
**功能编号**: LIVE-4.1.2  
**优先级**: 🔴 P0

**痛点**
- 无法处理游戏中断局面
- 作废局无统一处理流程
- 玩家投注退还不及时

**功能设计**
```
真人视讯 → 局务管理 → 作废局

【作废场景】
1. 技术故障（断线/卡顿）
2. 荷官操作失误
3. 设备故障（洗牌机/扫描仪）
4. 外部干扰

【处理流程】
1. 标记游戏局为"作废"
2. 自动退还所有玩家投注
3. 记录作废原因
4. 生成作废报告
5. 通知玩家
```

**技术实现**
```javascript
// 作废局处理
async function voidGameRound(game_round_id, reason) {
  // 1. 更新游戏局状态
  await db('game_rounds')
    .where('id', game_round_id)
    .update({
      status: 'void',
      void_reason: reason,
      voided_at: new Date()
    });
  
  // 2. 获取所有投注
  const bets = await db('bets')
    .where('game_round_id', game_round_id)
    .where('status', 'pending');
  
  // 3. 退还投注
  for (const bet of bets) {
    await db('bets')
      .where('id', bet.id)
      .update({ status: 'void', voided_at: new Date() });
    
    await adjustPlayerBalance(bet.player_id, bet.amount, 'void_refund');
  }
  
  // 4. 通知玩家
  await notifyPlayers(bets, '游戏局已作废，投注已退还');
  
  return { affected_bets: bets.length };
}
```

**预期收益**
- ✅ 作废局处理时间从 **30分钟** 降至 **1分钟**
- ✅ 玩家满意度提升 **50%**
- ✅ 减少客诉处理成本

---

#### 4.1.3 手工补单
**功能编号**: LIVE-4.1.3  
**优先级**: 🟡 P1

**痛点**
- 投注记录丢失无法补录
- 玩家投诉无法追溯
- 缺少补单审计机制

**功能设计**
```
真人视讯 → 局务管理 → 手工补单

【补单流程】
1. 客服提交补单申请
2. 填写补单详情（玩家ID/游戏局/投注金额）
3. 上传证据（视频/截图）
4. 财务审核
5. 系统补录投注记录
6. 自动结算

【补单限制】
- 单次补单上限（1000元）
- 需要主管审批（>500元）
- 仅限24小时内游戏局
```

**技术实现**
```javascript
// 补单申请表
CREATE TABLE manual_bet_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  player_id INT,
  game_round_id BIGINT,
  bet_amount DECIMAL(10,2),
  bet_details JSON,
  reason TEXT,
  evidence_urls JSON,
  requester_id INT,
  approver_id INT,
  status VARCHAR(20),
  created_at TIMESTAMP
);

// 补单执行
async function executeManualBet(request) {
  // 1. 创建投注记录
  const bet_id = await db('bets').insert({
    player_id: request.player_id,
    game_round_id: request.game_round_id,
    amount: request.bet_amount,
    bet_details: request.bet_details,
    is_manual: true,
    created_at: new Date()
  });
  
  // 2. 扣除玩家余额
  await adjustPlayerBalance(
    request.player_id, 
    -request.bet_amount, 
    'manual_bet'
  );
  
  // 3. 结算投注
  const result = await getGameRoundResult(request.game_round_id);
  const payout = calculatePayout(request.bet_details, result);
  
  await updateBetResult(bet_id, payout);
  await adjustPlayerBalance(request.player_id, payout, 'bet_payout');
  
  // 4. 记录日志
  await logManualBet(request);
}
```

**预期收益**
- ✅ 补单处理时间从 **1小时** 降至 **5分钟**
- ✅ 提升玩家信任度
- ✅ 减少纠纷处理成本

---

#### 4.1.4 局级视频回放
**功能编号**: LIVE-4.1.4  
**优先级**: 🔴 P0

**痛点**
- 玩家投诉无法提供证据
- 无法回溯游戏过程
- 视频存储成本高

**功能设计**
```
真人视讯 → 局务管理 → 视频回放

【功能】
1. 按游戏局ID查询视频
2. 视频播放器（支持暂停/快进/截图）
3. 关键时刻标记（发牌/开牌/结果）
4. 水印保护（防止录屏）
5. 下载权限控制

【存储方案】
- 使用 Cloudflare R2 存储
- 视频保留期：7天（可配置）
- 分辨率：720p（节省成本）
- 压缩率：H.264编码
```

**技术实现**
```javascript
// 视频记录表
CREATE TABLE game_videos (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  game_round_id BIGINT UNIQUE,
  video_url VARCHAR(500),
  duration INT, // 秒
  file_size INT, // MB
  key_moments JSON, // 关键时刻标记
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_game_round (game_round_id)
);

// 获取视频播放URL
async function getVideoPlaybackUrl(game_round_id) {
  const video = await db('game_videos')
    .where('game_round_id', game_round_id)
    .first();
  
  if (!video) {
    return { error: '视频不存在或已过期' };
  }
  
  // 生成临时访问URL（1小时有效）
  const signedUrl = await generateR2SignedUrl(video.video_url, 3600);
  
  return {
    url: signedUrl,
    duration: video.duration,
    key_moments: video.key_moments
  };
}
```

**存储成本估算**
```
假设：
- 每局游戏视频：2分钟
- 视频大小：10MB（720p H.264）
- 每日游戏局数：1000局
- 视频保留期：7天

总存储需求：
10MB × 1000局 × 7天 = 70GB

Cloudflare R2 费用：
存储费用：$0.015/GB/月 × 70GB = $1.05/月
读取费用：可忽略（按需计费）

月成本：约 $1-2
```

**预期收益**
- ✅ 客诉处理效率提升 **90%**
- ✅ 减少无证据纠纷 **100%**
- ✅ 增强玩家信任度

---

### 4.2 风险控制与监控

#### 4.2.1 套利/洗码检测
**功能编号**: LIVE-4.2.1  
**优先级**: 🔴 P0

**痛点**
- 套利行为难以识别
- 洗码团伙损害平台利益
- 人工监控成本高

**功能设计**
```
风控中心 → 套利检测

【检测规则】
1. 对冲投注（同一游戏局对立投注）
2. 异常投注模式（固定金额/固定间隔）
3. 多账号协同（同IP/同设备）
4. 快速流水刷单

【检测算法】
- 实时监控投注行为
- 机器学习模型识别异常
- 多维度风险评分
```

**技术实现**
```javascript
// 套利检测算法
async function detectArbitrage(game_round_id) {
  const bets = await db('bets')
    .where('game_round_id', game_round_id);
  
  // 1. 检测对冲投注
  const playerBets = {};
  for (const bet of bets) {
    if (!playerBets[bet.player_id]) {
      playerBets[bet.player_id] = [];
    }
    playerBets[bet.player_id].push(bet);
  }
  
  const alerts = [];
  for (const [player_id, bets] of Object.entries(playerBets)) {
    // 检测是否有对立投注
    const hasBanker = bets.some(b => b.bet_type === 'banker');
    const hasPlayer = bets.some(b => b.bet_type === 'player');
    
    if (hasBanker && hasPlayer) {
      alerts.push({
        type: 'hedge_betting',
        player_id: player_id,
        game_round_id: game_round_id,
        risk_level: 'high'
      });
    }
  }
  
  // 2. 检测同IP多账号
  const ipGroups = groupBy(bets, 'ip_address');
  for (const [ip, bets] of Object.entries(ipGroups)) {
    if (bets.length > 5) {
      alerts.push({
        type: 'same_ip_multi_account',
        ip_address: ip,
        account_count: bets.length,
        risk_level: 'medium'
      });
    }
  }
  
  // 3. 保存告警
  if (alerts.length > 0) {
    await db('risk_alerts').insert(alerts);
    await notifyRiskTeam(alerts);
  }
  
  return alerts;
}
```

**预期收益**
- ✅ 套利检测准确率 **>90%**
- ✅ 减少套利损失 **80%**
- ✅ 实时告警响应

---

#### 4.2.2 同IP多账号告警
**功能编号**: LIVE-4.2.2  
**优先级**: 🟡 P1

**痛点**
- 工作室批量注册账号
- 多账号薅羊毛
- 难以识别关联账号

**功能设计**
```
风控中心 → 设备指纹监控

【告警条件】
1. 同IP登录账号数 > 5个
2. 同设备指纹账号数 > 3个
3. 同一时段批量注册

【处理措施】
- 实时告警推送
- 自动冻结可疑账号
- 限制新账号注册
- 关联账号分析
```

**技术实现**
```javascript
// 设备指纹表
CREATE TABLE device_fingerprints (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  player_id INT,
  fingerprint VARCHAR(100), // 浏览器指纹
  ip_address VARCHAR(50),
  user_agent TEXT,
  first_seen TIMESTAMP,
  last_seen TIMESTAMP,
  INDEX idx_fingerprint (fingerprint),
  INDEX idx_ip (ip_address)
);

// 检测同IP多账号
async function detectMultiAccountSameIP() {
  const today = new Date().toISOString().split('T')[0];
  
  const result = await db('device_fingerprints')
    .select('ip_address')
    .count('DISTINCT player_id as account_count')
    .where('last_seen', '>=', today)
    .groupBy('ip_address')
    .having('account_count', '>', 5);
  
  for (const row of result) {
    await createRiskAlert({
      type: 'same_ip_multi_account',
      ip_address: row.ip_address,
      account_count: row.account_count,
      risk_level: 'high'
    });
  }
}
```

**预期收益**
- ✅ 多账号检测准确率 **>85%**
- ✅ 减少优惠券滥用 **70%**
- ✅ 提升账号安全性

---

#### 4.2.3 机器人检测
**功能编号**: LIVE-4.2.3  
**优先级**: 🟢 P2

**痛点**
- 机器人自动投注
- 占用服务器资源
- 影响真实玩家体验

**功能设计**
```
风控中心 → 机器人检测

【检测特征】
1. 投注速度异常（<1秒完成投注）
2. 投注时间规律（固定间隔）
3. 无人类行为特征（无页面浏览/无鼠标移动）
4. API直接调用（绕过前端）

【检测方法】
- 行为分析（投注频率/金额分布）
- 验证码挑战
- 设备指纹验证
- 机器学习模型
```

**技术实现**
```javascript
// 机器人检测算法
function detectBot(player_activity) {
  let bot_score = 0;
  
  // 1. 检测投注速度
  const avg_bet_interval = calculateAverageBetInterval(player_activity);
  if (avg_bet_interval < 2) { // 少于2秒
    bot_score += 30;
  }
  
  // 2. 检测投注规律
  const interval_variance = calculateIntervalVariance(player_activity);
  if (interval_variance < 0.1) { // 间隔过于规律
    bot_score += 25;
  }
  
  // 3. 检测无人类行为
  const has_mouse_movement = player_activity.mouse_events > 0;
  const has_page_browsing = player_activity.page_views > 1;
  if (!has_mouse_movement || !has_page_browsing) {
    bot_score += 20;
  }
  
  // 4. 检测API直调
  const has_referer = player_activity.has_referer;
  if (!has_referer) {
    bot_score += 25;
  }
  
  return {
    is_bot: bot_score > 60,
    score: bot_score,
    confidence: bot_score / 100
  };
}
```

**预期收益**
- ✅ 机器人检测准确率 **>80%**
- ✅ 减少服务器负载 **30%**
- ✅ 提升真实玩家体验

---

### 4.3 互动与内容生态

#### 4.3.1 聊天审核
**功能编号**: LIVE-4.3.1  
**优先级**: 🟡 P1

**痛点**
- 聊天室垃圾信息泛滥
- 广告/辱骂无法及时清理
- 人工审核成本高

**功能设计**
```
内容管理 → 聊天审核

【审核方式】
1. 敏感词过滤（自动拦截）
2. AI内容识别（违规内容检测）
3. 人工审核（举报处理）

【处理措施】
- 自动禁言（1小时/24小时/永久）
- 消息撤回
- 账号警告/封禁
```

**技术实现**
```javascript
// 敏感词过滤
const sensitiveWords = ['广告', '加微信', '刷单', '辱骂词汇'];

function filterChatMessage(message) {
  for (const word of sensitiveWords) {
    if (message.includes(word)) {
      return {
        allowed: false,
        reason: '包含敏感词',
        action: 'block'
      };
    }
  }
  
  return { allowed: true };
}

// AI内容审核（调用第三方API）
async function aiModeration(message) {
  const result = await callModerationAPI(message);
  
  if (result.is_spam || result.is_abusive) {
    await banUser(message.player_id, '24h');
    await deleteMessage(message.id);
  }
}
```

**预期收益**
- ✅ 违规内容拦截率 **>95%**
- ✅ 人工审核工作量降低 **80%**
- ✅ 提升聊天室环境质量

---

#### 4.3.2 玩家举报处理
**功能编号**: LIVE-4.3.2  
**优先级**: 🟢 P2

**痛点**
- 举报入口不明显
- 举报处理慢
- 无处理结果反馈

**功能设计**
```
内容管理 → 玩家举报

【举报流程】
1. 玩家提交举报（选择类型/截图/描述）
2. 客服审核
3. 处理措施（警告/禁言/封号）
4. 反馈举报人

【举报类型】
- 聊天违规
- 恶意行为
- 外挂作弊
- 其他
```

**预期收益**
- ✅ 举报处理效率提升 **60%**
- ✅ 提升社区自治能力
- ✅ 增强玩家归属感

---

### 4.4 财务与核算

#### 4.4.1 实时对账
**功能编号**: LIVE-4.4.1  
**优先级**: 🟡 P1

**痛点**
- 财务对账延迟
- 数据不一致难以发现
- 月底对账工作量大

**功能设计**
```
财务管理 → 实时对账

【对账维度】
1. 玩家余额 vs 财务流水
2. 投注金额 vs 游戏记录
3. 充值金额 vs 支付网关
4. 提现金额 vs 银行流水

【自动对账】
- 每小时自动对账
- 差异自动告警
- 生成对账报告
```

**技术实现**
```javascript
// 对账逻辑
async function reconcilePlayerBalance(player_id) {
  // 1. 计算财务流水总和
  const transactions = await db('player_transactions')
    .where('player_id', player_id)
    .sum('amount as total');
  
  // 2. 获取玩家当前余额
  const player = await db('players')
    .where('id', player_id)
    .first();
  
  // 3. 对比差异
  const difference = player.balance - transactions.total;
  
  if (Math.abs(difference) > 0.01) {
    await createAlert({
      type: 'balance_mismatch',
      player_id: player_id,
      expected: transactions.total,
      actual: player.balance,
      difference: difference
    });
  }
}
```

**预期收益**
- ✅ 对账效率提升 **90%**
- ✅ 数据准确性 **>99.99%**
- ✅ 减少财务纠纷

---

#### 4.4.2 异常账务处理
**功能编号**: LIVE-4.4.2  
**优先级**: 🟡 P1

**痛点**
- 异常账务无法快速定位
- 手工调账流程复杂
- 缺少审计记录

**功能设计**
```
财务管理 → 异常处理

【异常类型】
1. 余额异常（负数余额）
2. 重复充值
3. 提现失败未退款
4. 游戏结算错误

【处理流程】
1. 发现异常
2. 冻结账户
3. 人工审核
4. 调账处理
5. 解冻账户
6. 记录日志
```

**预期收益**
- ✅ 异常处理时间从 **1天** 降至 **1小时**
- ✅ 减少资金风险
- ✅ 提升财务安全性

---

## 📊 功能汇总表

### 一、效率类功能（8个）
| 编号 | 功能 | 优先级 | 核心价值 |
|------|------|--------|----------|
| EFF-1.1.1 | 批量状态变更 | 🔴 P0 | 效率提升90% |
| EFF-1.1.2 | 批量审核 | 🔴 P0 | 审核时间缩短80% |
| EFF-1.1.3 | 批量导入/导出 | 🟡 P1 | 数据操作效率95% |
| EFF-1.2.1 | 复合条件查询 | 🟡 P1 | 查询准确度60% |
| EFF-1.2.2 | 快捷预览 | 🟢 P2 | 页面跳转减少80% |
| EFF-1.2.3 | 智能推荐筛选 | 🟢 P2 | 新员工上手速度60% |
| EFF-1.3.1 | 操作预览 | 🟡 P1 | 误操作率降低95% |
| EFF-1.3.2 | 批量预验证 | 🟡 P1 | 导入成功率>99% |

### 二、流程与控制类（10个）
| 编号 | 功能 | 优先级 | 核心价值 |
|------|------|--------|----------|
| CTL-2.1.1 | 统一审核队列 | 🔴 P0 | 审核效率40% |
| CTL-2.1.2 | 审核优先级控制 | 🟡 P1 | VIP满意度50% |
| CTL-2.1.3 | 审核规则引擎 | 🟢 P2 | 人工审核量降低60% |
| CTL-2.2.1 | 系统参数配置 | 🔴 P0 | 配置响应秒级 |
| CTL-2.2.2 | 文本配置 | 🟡 P1 | 文案修改实时 |
| CTL-2.2.3 | 功能开关 | 🔴 P0 | 紧急响应秒级 |
| CTL-2.2.4 | 维护模式 | 🔴 P0 | 数据一致性100% |
| CTL-2.3.1 | 异常自动推送 | 🟡 P1 | 异常发现分钟级 |
| CTL-2.3.2 | 审核提醒 | 🟢 P2 | 审核响应速度50% |

### 三、安全与风控类（10个）
| 编号 | 功能 | 优先级 | 核心价值 |
|------|------|--------|----------|
| SEC-3.1.1 | 完整操作日志 | 🔴 P0 | 追溯能力100% |
| SEC-3.1.2 | 操作日志界面 | 🔴 P0 | 日志查询效率90% |
| SEC-3.1.3 | 详细操作记录 | 🟡 P1 | 问题定位准确度80% |
| SEC-3.1.4 | 数据变更对比 | 🟡 P1 | 数据审核效率70% |
| SEC-3.1.5 | 日志查询界面 | 🟡 P1 | 查询速度10倍 |
| SEC-3.2.1 | 二次确认 | 🔴 P0 | 误操作率降低95% |
| SEC-3.2.2 | 审批流程 | 🟡 P1 | 敏感操作风险80% |
| SEC-3.3.1 | 功能级权限 | 🔴 P0 | 权限精细度10倍 |
| SEC-3.3.2 | 数据级权限 | 🟡 P1 | 数据安全性90% |

### 四、真人视讯垂直功能（13个）
| 编号 | 功能 | 优先级 | 核心价值 |
|------|------|--------|----------|
| LIVE-4.1.1 | 改单/重结算系统 | 🔴 P0 | 游戏公平性100% |
| LIVE-4.1.2 | 作废局 | 🔴 P0 | 处理时间1分钟 |
| LIVE-4.1.3 | 手工补单 | 🟡 P1 | 补单时间5分钟 |
| LIVE-4.1.4 | 局级视频回放 | 🔴 P0 | 客诉效率90% |
| LIVE-4.2.1 | 套利/洗码检测 | 🔴 P0 | 检测准确率>90% |
| LIVE-4.2.2 | 同IP多账号告警 | 🟡 P1 | 检测准确率>85% |
| LIVE-4.2.3 | 机器人检测 | 🟢 P2 | 检测准确率>80% |
| LIVE-4.3.1 | 聊天审核 | 🟡 P1 | 拦截率>95% |
| LIVE-4.3.2 | 玩家举报处理 | 🟢 P2 | 处理效率60% |
| LIVE-4.4.1 | 实时对账 | 🟡 P1 | 对账效率90% |
| LIVE-4.4.2 | 异常账务处理 | 🟡 P1 | 处理时间1小时 |

---

## 🎯 技术依赖与风险评估

### 核心技术栈
- **后端框架**: Hono (Cloudflare Workers)
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2
- **前端**: TailwindCSS + Vanilla JS
- **部署**: Cloudflare Pages

### 关键风险点
1. **视频回放系统**: 需要确认游戏平台是否支持视频录制
2. **实时对账**: 高频率对账可能影响数据库性能
3. **机器学习检测**: 需要训练数据和模型优化
4. **第三方支付对接**: 需要协调多个支付网关

### 性能优化建议
- **数据库索引**: 核心查询字段必须添加索引
- **缓存策略**: 高频读取数据使用 Cloudflare KV 缓存
- **异步处理**: 批量操作使用后台任务队列
- **CDN加速**: 静态资源使用 Cloudflare CDN

---

## 📞 联系方式

**项目负责人**: Owen  
**邮箱**: cnwen123@gmail.com  
**GitHub仓库**:  
- 主仓库: https://github.com/CNWEN123/backstage-01A
- 备份仓库: https://github.com/CNWEN123/Live-dealer-backstage-01

---

## 📚 相关文档

1. [运营功能路线图](OPERATIONAL_FEATURES_ROADMAP.md)
2. [功能对比表](FEATURES_COMPARISON_TABLE.md)
3. [限额配置指南](LIMIT_CONFIGURATION_GUIDE.md)
4. [快速决策参考指南](QUICK_DECISION_GUIDE.md)

---

**文档结束**  
_最后更新：2025-12-13_
