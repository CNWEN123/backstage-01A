-- 转账记录表
CREATE TABLE IF NOT EXISTS transfer_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  from_player_id INTEGER NOT NULL,
  to_player_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  fee REAL DEFAULT 0,
  actual_amount REAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed', 'cancelled')),
  fee_config_id INTEGER,
  remark TEXT,
  reviewed_by INTEGER,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_player_id) REFERENCES players(id),
  FOREIGN KEY (to_player_id) REFERENCES players(id),
  FOREIGN KEY (reviewed_by) REFERENCES admins(id)
);

-- 转账手续费配置表
CREATE TABLE IF NOT EXISTS transfer_fee_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  vip_level INTEGER DEFAULT -1,
  min_amount REAL DEFAULT 0,
  max_amount REAL DEFAULT 0,
  fee_type TEXT DEFAULT 'percentage' CHECK(fee_type IN ('percentage', 'fixed')),
  fee_value REAL NOT NULL,
  min_fee REAL DEFAULT 0,
  max_fee REAL DEFAULT 0,
  priority INTEGER DEFAULT 0,
  is_enabled INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_transfer_records_status ON transfer_records(status);
CREATE INDEX IF NOT EXISTS idx_transfer_records_created_at ON transfer_records(created_at);
CREATE INDEX IF NOT EXISTS idx_transfer_records_from_player ON transfer_records(from_player_id);
CREATE INDEX IF NOT EXISTS idx_transfer_records_to_player ON transfer_records(to_player_id);
CREATE INDEX IF NOT EXISTS idx_transfer_records_order_no ON transfer_records(order_no);
CREATE INDEX IF NOT EXISTS idx_transfer_fee_priority ON transfer_fee_configs(priority DESC);

-- 插入默认手续费配置
INSERT OR IGNORE INTO transfer_fee_configs (id, name, vip_level, min_amount, max_amount, fee_type, fee_value, min_fee, max_fee, priority, is_enabled) VALUES
(1, '普通会员默认费率', -1, 0, 0, 'percentage', 2.0, 1, 100, 10, 1),
(2, 'VIP5专属优惠费率', 5, 1000, 50000, 'percentage', 0.5, 5, 100, 100, 1),
(3, '小额转账固定费', -1, 100, 1000, 'fixed', 5, 0, 0, 50, 1),
(4, '大额转账优惠费率', -1, 10000, 0, 'percentage', 1.0, 50, 500, 80, 1);
