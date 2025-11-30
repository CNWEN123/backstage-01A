-- 真人荷官视讯后台管理系统 V2.1 完整数据库架构
-- ============================================================================

-- 1. 管理员表
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  role TEXT DEFAULT 'operator',
  permissions TEXT,
  two_fa_enabled INTEGER DEFAULT 0,
  two_fa_secret TEXT,
  ip_whitelist TEXT,
  status INTEGER DEFAULT 1,
  last_login_at DATETIME,
  last_login_ip TEXT,
  login_fail_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 代理表
CREATE TABLE IF NOT EXISTS agents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  level TEXT DEFAULT 'agent',
  parent_agent_id INTEGER,
  share_ratio REAL DEFAULT 0,
  commission_ratio REAL DEFAULT 0,
  turnover_rate REAL DEFAULT 0,
  currency TEXT DEFAULT 'CNY',
  default_commission_scheme_id INTEGER,
  default_limit_group_id INTEGER,
  contact_phone TEXT,
  contact_email TEXT,
  contact_telegram TEXT,
  status INTEGER DEFAULT 1,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. 洗码方案表
CREATE TABLE IF NOT EXISTS commission_schemes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scheme_name TEXT NOT NULL,
  description TEXT,
  settlement_cycle INTEGER DEFAULT 1,
  min_valid_bet REAL DEFAULT 0,
  daily_max_amount REAL,
  auto_payout_threshold REAL DEFAULT 1000,
  baccarat_rate REAL DEFAULT 0.006,
  dragon_tiger_rate REAL DEFAULT 0.006,
  roulette_rate REAL DEFAULT 0.004,
  sicbo_rate REAL DEFAULT 0.005,
  niuniu_rate REAL DEFAULT 0.005,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. 限红组表
CREATE TABLE IF NOT EXISTS limit_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_name TEXT NOT NULL,
  description TEXT,
  baccarat_limits TEXT,
  dragon_tiger_limits TEXT,
  roulette_limits TEXT,
  sicbo_limits TEXT,
  niuniu_limits TEXT,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. 玩家表
CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  real_name TEXT,
  phone TEXT,
  email TEXT,
  balance REAL DEFAULT 0,
  frozen_balance REAL DEFAULT 0,
  status INTEGER DEFAULT 0,
  kyc_status INTEGER DEFAULT 0,
  kyc_verified_at DATETIME,
  agent_id INTEGER,
  vip_level INTEGER DEFAULT 0,
  commission_scheme_id INTEGER,
  limit_group_id INTEGER,
  risk_level INTEGER DEFAULT 0,
  risk_tags TEXT,
  ltv REAL DEFAULT 0,
  total_deposit REAL DEFAULT 0,
  total_withdraw REAL DEFAULT 0,
  total_bet REAL DEFAULT 0,
  total_valid_bet REAL DEFAULT 0,
  total_win_loss REAL DEFAULT 0,
  total_bonus REAL DEFAULT 0,
  total_commission REAL DEFAULT 0,
  deposit_count INTEGER DEFAULT 0,
  withdraw_count INTEGER DEFAULT 0,
  bet_count INTEGER DEFAULT 0,
  register_ip TEXT,
  register_source TEXT,
  last_login_at DATETIME,
  last_login_ip TEXT,
  bank_cards TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. 玩家银行卡表
CREATE TABLE IF NOT EXISTS player_bank_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  bank_name TEXT NOT NULL,
  bank_code TEXT,
  card_number TEXT NOT NULL,
  card_holder TEXT NOT NULL,
  branch_name TEXT,
  province TEXT,
  city TEXT,
  is_default INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. 玩家标签表
CREATE TABLE IF NOT EXISTS player_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tag_name TEXT NOT NULL,
  tag_type TEXT,
  color TEXT,
  description TEXT,
  status INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. 玩家标签关联表
CREATE TABLE IF NOT EXISTS player_tag_relations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. 玩家会话表
CREATE TABLE IF NOT EXISTS player_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  session_id TEXT,
  current_table_code TEXT,
  current_game_type TEXT,
  login_ip TEXT,
  device_type TEXT,
  is_online INTEGER DEFAULT 0,
  last_active_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. 交易流水表
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  player_id INTEGER NOT NULL,
  transaction_type INTEGER NOT NULL,
  balance_before REAL DEFAULT 0,
  amount REAL NOT NULL,
  balance_after REAL DEFAULT 0,
  related_order_id TEXT,
  game_type TEXT,
  audit_status INTEGER DEFAULT 0,
  remark TEXT,
  operator_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. 存款申请表
CREATE TABLE IF NOT EXISTS deposit_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  player_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  actual_amount REAL,
  payment_method TEXT,
  payment_channel TEXT,
  is_first_deposit INTEGER DEFAULT 0,
  bonus_amount REAL DEFAULT 0,
  status INTEGER DEFAULT 0,
  reviewer_id INTEGER,
  review_remark TEXT,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. 提款申请表
CREATE TABLE IF NOT EXISTS withdraw_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  player_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  actual_amount REAL,
  bank_name TEXT,
  bank_card_no TEXT,
  bank_holder_name TEXT,
  turnover_required REAL DEFAULT 0,
  turnover_achieved REAL DEFAULT 0,
  turnover_rate REAL DEFAULT 0,
  status INTEGER DEFAULT 0,
  risk_level INTEGER DEFAULT 0,
  risk_alert TEXT,
  first_reviewer_id INTEGER,
  first_review_remark TEXT,
  first_review_at DATETIME,
  payout_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 13. 注单表
CREATE TABLE IF NOT EXISTS bets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bet_no TEXT UNIQUE NOT NULL,
  player_id INTEGER NOT NULL,
  agent_id INTEGER,
  game_type TEXT NOT NULL,
  table_code TEXT,
  game_round_id TEXT,
  bet_detail TEXT,
  bet_type TEXT,
  bet_amount REAL NOT NULL,
  valid_bet_amount REAL DEFAULT 0,
  odds REAL DEFAULT 1,
  payout REAL DEFAULT 0,
  win_loss_amount REAL DEFAULT 0,
  bet_status INTEGER DEFAULT 0,
  bet_ip TEXT,
  ip_location TEXT,
  is_high_odds INTEGER DEFAULT 0,
  is_large_bet INTEGER DEFAULT 0,
  risk_flag TEXT,
  video_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  settled_at DATETIME
);

-- 14. 游戏结果表
CREATE TABLE IF NOT EXISTS game_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_round_id TEXT UNIQUE NOT NULL,
  game_type TEXT NOT NULL,
  table_code TEXT,
  dealer_id INTEGER,
  result_detail TEXT,
  result_summary TEXT,
  video_url TEXT,
  total_bet_amount REAL DEFAULT 0,
  total_payout REAL DEFAULT 0,
  company_profit REAL DEFAULT 0,
  bet_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 15. 洗码记录表
CREATE TABLE IF NOT EXISTS commission_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  agent_id INTEGER,
  scheme_id INTEGER,
  settle_date DATE,
  baccarat_valid_bet REAL DEFAULT 0,
  baccarat_rate REAL DEFAULT 0,
  baccarat_amount REAL DEFAULT 0,
  dragon_tiger_valid_bet REAL DEFAULT 0,
  dragon_tiger_rate REAL DEFAULT 0,
  dragon_tiger_amount REAL DEFAULT 0,
  roulette_valid_bet REAL DEFAULT 0,
  roulette_rate REAL DEFAULT 0,
  roulette_amount REAL DEFAULT 0,
  sicbo_valid_bet REAL DEFAULT 0,
  sicbo_rate REAL DEFAULT 0,
  sicbo_amount REAL DEFAULT 0,
  niuniu_valid_bet REAL DEFAULT 0,
  niuniu_rate REAL DEFAULT 0,
  niuniu_amount REAL DEFAULT 0,
  total_valid_bet REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  status INTEGER DEFAULT 0,
  reviewer_id INTEGER,
  review_remark TEXT,
  reviewed_at DATETIME,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 16. 红利记录表
CREATE TABLE IF NOT EXISTS bonus_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE,
  player_id INTEGER NOT NULL,
  bonus_type TEXT,
  amount REAL NOT NULL,
  turnover_requirement REAL DEFAULT 0,
  status INTEGER DEFAULT 0,
  remark TEXT,
  operator_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 17. 风控预警表
CREATE TABLE IF NOT EXISTS risk_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER,
  alert_type TEXT NOT NULL,
  severity INTEGER DEFAULT 2,
  title TEXT,
  description TEXT,
  related_data TEXT,
  status INTEGER DEFAULT 0,
  action_taken TEXT,
  handle_remark TEXT,
  handler_id INTEGER,
  handled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 18. 荷官表
CREATE TABLE IF NOT EXISTS dealers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id TEXT UNIQUE NOT NULL,
  stage_name_cn TEXT,
  stage_name_en TEXT,
  avatar_url TEXT,
  portrait_url TEXT,
  gender INTEGER DEFAULT 0,
  hire_date DATE,
  dealer_status INTEGER DEFAULT 1,
  skills TEXT,
  rating REAL DEFAULT 5.0,
  real_name TEXT,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 19. 桌台表
CREATE TABLE IF NOT EXISTS game_tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_code TEXT UNIQUE NOT NULL,
  table_name TEXT,
  game_type TEXT NOT NULL,
  room_id INTEGER,
  primary_stream_url TEXT,
  backup_stream_url TEXT,
  limit_group_id INTEGER,
  current_dealer_id INTEGER,
  table_status INTEGER DEFAULT 1,
  min_bet REAL,
  max_bet REAL,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 20. 荷官排班表
CREATE TABLE IF NOT EXISTS dealer_shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id INTEGER,
  dealer_id INTEGER NOT NULL,
  shift_date DATE NOT NULL,
  shift_start_time TEXT,
  shift_end_time TEXT,
  status INTEGER DEFAULT 0,
  has_conflict INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 21. 荷官请假表
CREATE TABLE IF NOT EXISTS dealer_leaves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dealer_id INTEGER NOT NULL,
  leave_type TEXT,
  start_date DATE,
  end_date DATE,
  reason TEXT,
  status INTEGER DEFAULT 0,
  approved_by INTEGER,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 22. 内容管理表
CREATE TABLE IF NOT EXISTS contents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  link_target TEXT DEFAULT '_self',
  language TEXT DEFAULT 'zh-CN',
  target_level TEXT DEFAULT 'all',
  platform TEXT DEFAULT 'all',
  status INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  publish_at DATETIME,
  expire_at DATETIME,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 23. 审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operator_id INTEGER,
  operator_name TEXT,
  operator_role TEXT,
  module TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  old_value TEXT,
  new_value TEXT,
  description TEXT,
  ip_address TEXT,
  risk_level INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 24. 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  config_group TEXT,
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT,
  value_type TEXT DEFAULT 'string',
  description TEXT,
  is_public INTEGER DEFAULT 0,
  updated_by INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 25. 代理转移日志表
CREATE TABLE IF NOT EXISTS agent_transfer_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  from_agent_id INTEGER,
  to_agent_id INTEGER NOT NULL,
  reason TEXT,
  operator_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 26. VIP等级表
CREATE TABLE IF NOT EXISTS vip_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER UNIQUE NOT NULL,
  level_name TEXT,
  points_required INTEGER DEFAULT 0,
  upgrade_bonus REAL DEFAULT 0,
  birthday_bonus REAL DEFAULT 0,
  withdraw_limit_daily REAL,
  deposit_bonus_rate REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 27. 游戏房间表
CREATE TABLE IF NOT EXISTS game_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_name TEXT NOT NULL,
  room_type TEXT,
  description TEXT,
  table_count INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 28. 收款方式表
CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  method_code TEXT UNIQUE NOT NULL,
  method_name TEXT NOT NULL,
  method_type TEXT DEFAULT 'bank',
  currency TEXT DEFAULT 'CNY',
  min_amount REAL DEFAULT 100,
  max_amount REAL DEFAULT 1000000,
  fee_rate REAL DEFAULT 0,
  fee_fixed REAL DEFAULT 0,
  account_info TEXT,
  qr_code_url TEXT,
  instructions TEXT,
  supported_banks TEXT,
  status INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_players_agent ON players(agent_id);
CREATE INDEX IF NOT EXISTS idx_players_status ON players(status);
CREATE INDEX IF NOT EXISTS idx_bets_player ON bets(player_id);
CREATE INDEX IF NOT EXISTS idx_bets_created ON bets(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_player ON transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_withdraw_status ON withdraw_requests(status);
CREATE INDEX IF NOT EXISTS idx_deposit_status ON deposit_requests(status);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_status ON risk_alerts(status);
CREATE INDEX IF NOT EXISTS idx_commission_status ON commission_records(status);
CREATE INDEX IF NOT EXISTS idx_shifts_date ON dealer_shifts(shift_date);
CREATE INDEX IF NOT EXISTS idx_payment_methods_status ON payment_methods(status);
