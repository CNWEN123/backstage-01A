# 测试数据说明

## 数据量

- **股东 (Shareholder)**: 30个 (shareholder_01 ~ shareholder_30)
- **代理 (Agent)**: 31个 (1个原有 + 30个新增: agent_001 ~ agent_030)
- **总计**: 61个代理

## 数据分布

### 股东 (ID 2-31)
- **账号格式**: `shareholder_01` 到 `shareholder_30`
- **昵称格式**: `股东001` 到 `股东030`
- **占成比**: 45% ~ 55% (随机分布)
- **佣金率**: 5% (固定)
- **洗码率**: 0.8% (固定)
- **邀请码**: `SH001` ~ `SH030`
- **注册时间**: 最近30天内分散

### 代理 (ID 32-61)
- **账号格式**: `agent_001` 到 `agent_030`
- **昵称格式**: `代理001` 到 `代理030`
- **占成比**: 28% ~ 35% (随机分布)
- **佣金率**: 3% (固定)
- **洗码率**: 0.6% (固定)
- **邀请码**: `AG001` ~ `AG030`
- **上级分配**: 每2个代理分配给不同股东 (ID 2-16)
- **注册时间**: 最近30天内分散

### 联系方式
- **电话**: `+1-555-xxxx` (根据ID生成)
- **邮箱**: `[username]@example.com`

## 层级结构

```
test_agent_002 (原有代理)
├─ 7个玩家

shareholder_01 (股东001)
├─ agent_001 (代理001)
└─ agent_002 (代理002)

shareholder_02 (股东002)
├─ agent_003 (代理003)
└─ agent_004 (代理004)

...

shareholder_15 (股东015)
├─ agent_029 (代理029)
└─ agent_030 (代理030)

shareholder_16 ~ shareholder_30 (无下级代理)
```

## 测试场景

### 1. 大数据量列表显示
- 61个代理的表格展示
- 滚动性能测试
- 分页和排序功能

### 2. 层级树结构
- 30个顶级股东节点
- 15个有下级的股东（每个2个下级）
- 树状图折叠/展开性能

### 3. 查询功能
- 按等级筛选：股东(30) / 代理(31)
- 按占成比范围筛选：28% ~ 55%
- 按上级代理筛选：15个有下级的股东
- 组合查询测试

### 4. 统计功能
- 总代理数：61
- 总下级数：30 (来自15个股东)
- 总玩家数：7 (来自原有代理)

## 生成脚本

### 1. 生成代理
```bash
npx wrangler d1 execute live_dealer_db --local --file=./generate_test_agents.sql
```

### 2. 更新联系方式
```bash
npx wrangler d1 execute live_dealer_db --local --file=./update_agent_contact.sql
```

## 清理测试数据

如果需要清理测试数据，可以执行：

```sql
-- 删除测试代理（保留ID=1的原有代理）
DELETE FROM agents WHERE id > 1;

-- 重置自增ID
DELETE FROM sqlite_sequence WHERE name='agents';
INSERT INTO sqlite_sequence (name, seq) VALUES ('agents', 1);
```

## 注意事项

1. 测试数据使用简单的密码哈希 `$2a$10$abcdefghijklmnopqrstuv`
2. 玩家数据当前为0，可以通过 `update_agent_players.sql` 生成
3. 所有代理状态默认为 `1` (启用)
4. 货币默认为 `CNY`，但前端已统一显示为 `USD`
