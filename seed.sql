-- ============================================================================
-- 真人荷官视讯后台管理系统 V2.1 完整测试数据
-- ============================================================================

-- ============================================================================
-- 1. 管理员账号
-- ============================================================================
INSERT OR IGNORE INTO admins (username, password_hash, nickname, role, two_fa_enabled, status, permissions) VALUES
('admin_root', 'admin123', '超级管理员', 'super_admin', 1, 1, '["*"]'),
('finance_lead', 'finance123', '财务总监', 'finance', 1, 1, '["finance.*","reports.*","players.view"]'),
('finance_01', 'finance123', '财务专员A', 'finance', 0, 1, '["finance.deposit","finance.withdraw","reports.view"]'),
('risk_manager', 'risk123', '风控主管', 'risk', 1, 1, '["risk.*","players.*","bets.*"]'),
('risk_01', 'risk123', '风控专员A', 'risk', 0, 1, '["risk.view","risk.handle","bets.view"]'),
('cs_manager', 'cs123', '客服主管', 'customer_service', 0, 1, '["players.*","finance.manual","contents.*"]'),
('cs_01', 'cs123', '客服专员A', 'customer_service', 0, 1, '["players.view","players.edit","finance.manual"]'),
('ops_manager', 'ops123', '运营主管', 'operator', 0, 1, '["contents.*","reports.*","studio.*"]'),
('ops_01', 'ops123', '运营专员A', 'operator', 0, 1, '["contents.*","studio.view"]');

-- ============================================================================
-- 2. 洗码方案 (V2.1核心)
-- ============================================================================
INSERT OR IGNORE INTO commission_schemes (id, scheme_name, description, settlement_cycle, min_valid_bet, daily_max_amount, auto_payout_threshold, baccarat_rate, dragon_tiger_rate, roulette_rate, sicbo_rate, niuniu_rate, status) VALUES
(1, '普通会员方案', '适用于普通玩家的标准返水方案', 1, 1000, 50000, 1000, 0.0060, 0.0060, 0.0040, 0.0050, 0.0050, 1),
(2, 'VIP尊享方案', '高额返水，适用于VIP客户', 1, 0, 100000, 2000, 0.0080, 0.0080, 0.0060, 0.0070, 0.0070, 1),
(3, 'SVIP至尊方案', '顶级返水，仅限SVIP客户', 1, 0, 200000, 5000, 0.0100, 0.0100, 0.0080, 0.0090, 0.0090, 1),
(4, '代理专属方案', '代理线专用洗码方案', 2, 5000, 500000, 10000, 0.0070, 0.0070, 0.0050, 0.0060, 0.0060, 1),
(5, '新人体验方案', '新注册用户7天体验方案', 1, 500, 10000, 500, 0.0050, 0.0050, 0.0030, 0.0040, 0.0040, 1);

-- ============================================================================
-- 3. 限红组
-- ============================================================================
INSERT OR IGNORE INTO limit_groups (id, group_name, description, baccarat_limits, dragon_tiger_limits, roulette_limits, sicbo_limits, niuniu_limits) VALUES
(1, '标准限红组', '普通玩家标准限红', '{"min":100,"max":50000}', '{"min":100,"max":30000}', '{"min":50,"max":20000}', '{"min":50,"max":20000}', '{"min":100,"max":30000}'),
(2, 'VIP限红组', 'VIP客户专属限红', '{"min":500,"max":200000}', '{"min":500,"max":150000}', '{"min":200,"max":100000}', '{"min":200,"max":100000}', '{"min":500,"max":150000}'),
(3, 'SVIP限红组', 'SVIP客户最高限红', '{"min":1000,"max":500000}', '{"min":1000,"max":300000}', '{"min":500,"max":200000}', '{"min":500,"max":200000}', '{"min":1000,"max":300000}'),
(4, '高风险限红组', '高风险用户限制投注', '{"min":100,"max":5000}', '{"min":100,"max":3000}', '{"min":50,"max":2000}', '{"min":50,"max":2000}', '{"min":100,"max":3000}'),
(5, '新人限红组', '新用户观察期限红', '{"min":50,"max":10000}', '{"min":50,"max":8000}', '{"min":20,"max":5000}', '{"min":20,"max":5000}', '{"min":50,"max":8000}');

-- ============================================================================
-- 4. 代理层级 (金字塔结构)
-- ============================================================================
INSERT OR IGNORE INTO agents (id, agent_username, password_hash, nickname, level, parent_agent_id, share_ratio, commission_ratio, turnover_rate, currency, default_commission_scheme_id, default_limit_group_id, contact_phone, status) VALUES
-- 股东层
(1, 'SH_001', 'sh001', '股东张总', 'shareholder', NULL, 15.00, 5.00, 0.0080, 'CNY', 2, 2, '13800000001', 1),
(2, 'SH_002', 'sh002', '股东李总', 'shareholder', NULL, 12.00, 4.00, 0.0070, 'CNY', 2, 2, '13800000002', 1),
-- 总代层
(3, 'GA_North', 'ga001', '北方总代', 'general_agent', 1, 10.00, 3.00, 0.0060, 'CNY', 1, 1, '13800000003', 1),
(4, 'GA_South', 'ga002', '南方总代', 'general_agent', 1, 10.00, 3.00, 0.0060, 'CNY', 1, 1, '13800000004', 1),
(5, 'GA_East', 'ga003', '华东总代', 'general_agent', 2, 10.00, 3.00, 0.0060, 'CNY', 1, 1, '13800000005', 1),
-- 代理层
(6, 'AG_BJ_01', 'ag001', '北京代理A', 'agent', 3, 8.00, 2.00, 0.0050, 'CNY', 1, 1, '13800000006', 1),
(7, 'AG_BJ_02', 'ag002', '北京代理B', 'agent', 3, 8.00, 2.00, 0.0050, 'CNY', 1, 1, '13800000007', 1),
(8, 'AG_SH_01', 'ag003', '上海代理A', 'agent', 4, 8.00, 2.00, 0.0050, 'CNY', 1, 1, '13800000008', 1),
(9, 'AG_GZ_01', 'ag004', '广州代理A', 'agent', 4, 7.50, 2.00, 0.0045, 'CNY', 1, 1, '13800000009', 1),
(10, 'AG_HZ_01', 'ag005', '杭州代理A', 'agent', 5, 7.50, 2.00, 0.0045, 'CNY', 1, 1, '13800000010', 1);

-- ============================================================================
-- 5. 玩家数据 (完整CRM画像)
-- ============================================================================
INSERT OR IGNORE INTO players (id, username, password_hash, nickname, real_name, phone, balance, frozen_balance, status, kyc_status, agent_id, vip_level, commission_scheme_id, limit_group_id, risk_level, risk_tags, ltv, total_deposit, total_withdraw, total_bet, total_valid_bet, total_win_loss, total_bonus, total_commission, deposit_count, withdraw_count, bet_count, register_ip, last_login_ip, bank_cards) VALUES
-- VIP客户
(1, 'vip_whale_01', 'pass123', '鲸鱼王', '王大海', '13900000001', 520000.00, 0, 0, 1, 6, 6, 3, 3, 0, NULL, 128000.00, 1200000.00, 850000.00, 8500000.00, 8150000.00, -222000.00, 28000.00, 65200.00, 45, 32, 12580, '202.96.134.1', '202.96.134.5', '[{"bank":"工商银行","card_no":"6222****8888","holder":"王大海"}]'),
(2, 'vip_king_88', 'pass123', '豪客一号', '李富贵', '13900000002', 380000.00, 0, 0, 1, 6, 5, 2, 2, 0, NULL, 95000.00, 800000.00, 500000.00, 5200000.00, 5080000.00, -205000.00, 15000.00, 40640.00, 38, 25, 8920, '116.228.111.1', '116.228.111.8', '[{"bank":"建设银行","card_no":"6227****6666","holder":"李富贵"}]'),
(3, 'vip_player_01', 'pass123', '金牌VIP', '张三丰', '13900000003', 125400.00, 0, 0, 1, 7, 5, 2, 2, 0, NULL, 45200.00, 500000.00, 420000.00, 2500000.00, 2380000.00, -35000.00, 8000.00, 19040.00, 28, 18, 4520, '192.168.1.100', '192.168.1.102', '[{"bank":"招商银行","card_no":"6225****9999","holder":"张三丰"}]'),
-- 普通玩家
(4, 'normal_player_01', 'pass123', '小赌怡情', '赵六', '13900000004', 8500.00, 0, 0, 1, 8, 2, 1, 1, 0, NULL, 2500.00, 30000.00, 25000.00, 120000.00, 118000.00, -2500.00, 500.00, 708.00, 12, 8, 890, '180.163.100.1', '180.163.100.5', '[{"bank":"农业银行","card_no":"6228****5555","holder":"赵六"}]'),
(5, 'normal_player_02', 'pass123', '幸运星', '钱七', '13900000005', 3200.00, 0, 0, 1, 8, 1, 1, 1, 0, NULL, 1200.00, 15000.00, 10000.00, 45000.00, 42000.00, -3800.00, 200.00, 252.00, 8, 5, 420, '61.129.65.1', '61.129.65.8', '[{"bank":"中国银行","card_no":"6217****4444","holder":"钱七"}]'),
(6, 'normal_player_03', 'pass123', '菜鸟玩家', '孙八', '13900000006', 500.00, 0, 0, 0, 9, 0, 1, 5, 0, NULL, -200.00, 2000.00, 1500.00, 5000.00, 4800.00, -300.00, 0.00, 28.80, 3, 2, 85, '222.66.115.1', '222.66.115.1', NULL),
-- 冻结用户
(7, 'frozen_user_01', 'pass123', '冻结账户', '周九', '13900000007', 2100.00, 2100.00, 1, 1, 9, 1, 1, 4, 2, '["suspicious_activity"]', -500.00, 10000.00, 7500.00, 35000.00, 33000.00, -2500.00, 0.00, 198.00, 5, 3, 280, '123.125.71.1', '123.125.71.8', '[{"bank":"交通银行","card_no":"6222****3333","holder":"周九"}]'),
-- 高风险用户
(8, 'risk_user_99', 'pass123', '高风险账户', '吴十', '13900000008', 5500.00, 0, 0, 1, 10, 2, 1, 4, 3, '["arb_suspect","high_frequency"]', -8500.00, 50000.00, 38000.00, 120000.00, 108000.00, -20500.00, 0.00, 648.00, 15, 10, 1580, '203.0.113.99', '203.0.113.88', '[{"bank":"民生银行","card_no":"6226****2222","holder":"吴十"}]'),
-- 黑名单用户
(9, 'blacklist_user', 'pass123', '套利猎手', '郑十一', '13900000009', 0.00, 8800.00, 2, 1, 10, 2, 1, 4, 4, '["arb_confirmed","multi_account","bot_suspect"]', -2200.00, 20000.00, 9000.00, 85000.00, 82500.00, -10800.00, 0.00, 495.00, 8, 3, 920, '45.33.32.156', '185.199.108.1', NULL),
-- 新注册用户
(10, 'new_player_01', 'pass123', '萌新玩家', '王小明', '13900000010', 0.00, 0, 0, 0, 6, 0, 5, 5, 0, NULL, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, 0, 0, '114.114.114.1', '114.114.114.1', NULL),
(11, 'new_player_02', 'pass123', '新手上路', '李小红', '13900000011', 1000.00, 0, 0, 0, 7, 0, 5, 5, 0, NULL, 1000.00, 1000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, 0, 0, '8.8.8.8', '8.8.8.8', NULL);

-- ============================================================================
-- 6. 交易流水
-- ============================================================================
INSERT OR IGNORE INTO transactions (order_no, player_id, transaction_type, balance_before, amount, balance_after, related_order_id, game_type, audit_status, remark, created_at) VALUES
-- VIP玩家流水
('TXN20251129001', 1, 1, 470000.00, 50000.00, 520000.00, 'DEP20251129001', NULL, 1, '银行卡充值', datetime('now', '-2 hours')),
('TXN20251129002', 1, 3, 520000.00, -10000.00, 510000.00, 'BET20251129001', 'baccarat', 1, '百家乐投注', datetime('now', '-1 hours')),
('TXN20251129003', 1, 4, 510000.00, 19500.00, 529500.00, 'BET20251129001', 'baccarat', 1, '百家乐派彩', datetime('now', '-1 hours')),
('TXN20251129004', 2, 1, 330000.00, 50000.00, 380000.00, 'DEP20251129002', NULL, 1, '银行卡充值', datetime('now', '-3 hours')),
('TXN20251129005', 2, 2, 380000.00, -50000.00, 330000.00, 'WDR20251129001', NULL, 0, '提款申请', datetime('now', '-30 minutes')),
-- 普通玩家流水
('TXN20251129006', 4, 3, 9000.00, -500.00, 8500.00, 'BET20251129002', 'dragon_tiger', 1, '龙虎投注', datetime('now', '-45 minutes')),
('TXN20251129007', 5, 6, 3000.00, 200.00, 3200.00, 'COM20251128001', NULL, 1, '洗码返水', datetime('now', '-5 hours')),
-- 风险用户流水
('TXN20251129008', 8, 3, 15500.00, -10000.00, 5500.00, 'BET20251129003', 'baccarat', 1, '大额投注', datetime('now', '-20 minutes'));

-- ============================================================================
-- 7. 存款申请
-- ============================================================================
INSERT OR IGNORE INTO deposit_requests (order_no, player_id, amount, actual_amount, payment_method, payment_channel, is_first_deposit, bonus_amount, status, created_at) VALUES
('DEP20251129001', 1, 50000.00, 50000.00, 'bank_transfer', '工商银行', 0, 0, 2, datetime('now', '-2 hours')),
('DEP20251129002', 2, 50000.00, 50000.00, 'bank_transfer', '建设银行', 0, 0, 2, datetime('now', '-3 hours')),
('DEP20251129003', 11, 1000.00, 1000.00, 'alipay', '支付宝', 1, 100.00, 2, datetime('now', '-6 hours')),
('DEP20251129004', 4, 5000.00, NULL, 'bank_transfer', '农业银行', 0, 0, 1, datetime('now', '-10 minutes')),
('DEP20251129005', 6, 2000.00, NULL, 'wechat', '微信支付', 0, 0, 0, datetime('now', '-5 minutes'));

-- ============================================================================
-- 8. 提款申请 (含流水稽核)
-- ============================================================================
INSERT OR IGNORE INTO withdraw_requests (order_no, player_id, amount, bank_name, bank_card_no, bank_holder_name, turnover_required, turnover_achieved, turnover_rate, status, risk_level, risk_alert, created_at) VALUES
('WDR20251129001', 2, 50000.00, '建设银行', '6227****6666', '李富贵', 50000.00, 62000.00, 124.00, 0, 0, NULL, datetime('now', '-30 minutes')),
('WDR20251129002', 3, 20000.00, '招商银行', '6225****9999', '张三丰', 20000.00, 25000.00, 125.00, 0, 0, NULL, datetime('now', '-45 minutes')),
('WDR20251129003', 4, 3000.00, '农业银行', '6228****5555', '赵六', 3000.00, 2100.00, 70.00, 0, 1, '流水未达标', datetime('now', '-1 hours')),
('WDR20251129004', 8, 5000.00, '民生银行', '6226****2222', '吴十', 5000.00, 5500.00, 110.00, 0, 3, '高风险账户，需人工审核', datetime('now', '-15 minutes')),
('WDR20251128001', 1, 100000.00, '工商银行', '6222****8888', '王大海', 100000.00, 150000.00, 150.00, 4, 0, NULL, datetime('now', '-1 days'));

-- ============================================================================
-- 9. 注单数据
-- ============================================================================
INSERT OR IGNORE INTO bets (bet_no, player_id, agent_id, game_type, table_code, game_round_id, bet_detail, bet_type, bet_amount, valid_bet_amount, odds, payout, win_loss_amount, bet_status, bet_ip, ip_location, is_high_odds, is_large_bet, created_at, settled_at) VALUES
-- 已结算注单
('BET20251129001', 1, 6, 'baccarat', 'BAC-A01', 'R20251129-0001', '{"banker":10000}', 'banker', 10000.00, 10000.00, 0.95, 19500.00, 9500.00, 1, '202.96.134.5', '上海', 0, 0, datetime('now', '-1 hours'), datetime('now', '-1 hours')),
('BET20251129002', 4, 8, 'dragon_tiger', 'DT-B01', 'R20251129-0015', '{"dragon":500}', 'dragon', 500.00, 500.00, 1.00, 0.00, -500.00, 1, '180.163.100.5', '北京', 0, 0, datetime('now', '-45 minutes'), datetime('now', '-45 minutes')),
('BET20251129003', 8, 10, 'baccarat', 'BAC-A02', 'R20251129-0022', '{"player":10000}', 'player', 10000.00, 10000.00, 1.00, 0.00, -10000.00, 1, '203.0.113.88', '深圳', 0, 1, datetime('now', '-20 minutes'), datetime('now', '-20 minutes')),
('BET20251129004', 2, 6, 'baccarat', 'BAC-A01', 'R20251129-0025', '{"tie":5000}', 'tie', 5000.00, 5000.00, 8.00, 45000.00, 40000.00, 1, '116.228.111.8', '上海', 1, 0, datetime('now', '-15 minutes'), datetime('now', '-15 minutes')),
('BET20251129005', 1, 6, 'roulette', 'ROU-C01', 'R20251129-0088', '{"red":20000}', 'red', 20000.00, 20000.00, 1.00, 40000.00, 20000.00, 1, '202.96.134.5', '上海', 0, 1, datetime('now', '-10 minutes'), datetime('now', '-10 minutes')),
-- 未结算注单
('BET20251129006', 1, 6, 'baccarat', 'BAC-A01', 'R20251129-0100', '{"banker":15000}', 'banker', 15000.00, 15000.00, 0.95, 0.00, 0.00, 0, '202.96.134.5', '上海', 0, 1, datetime('now', '-1 minutes'), NULL),
('BET20251129007', 3, 7, 'dragon_tiger', 'DT-B01', 'R20251129-0100', '{"tiger":3000}', 'tiger', 3000.00, 3000.00, 1.00, 0.00, 0.00, 0, '192.168.1.102', '北京', 0, 0, datetime('now', '-30 seconds'), NULL);

-- ============================================================================
-- 10. 游戏开奖结果
-- ============================================================================
INSERT OR IGNORE INTO game_results (game_round_id, game_type, table_code, result_detail, result_summary, total_bet_amount, total_payout, company_profit, bet_count, created_at) VALUES
('R20251129-0001', 'baccarat', 'BAC-A01', '{"banker_cards":["H5","D8","S4"],"player_cards":["C3","H7"],"banker_point":7,"player_point":0,"winner":"banker"}', '庄赢 7:0', 125000.00, 118750.00, 6250.00, 15, datetime('now', '-1 hours')),
('R20251129-0015', 'dragon_tiger', 'DT-B01', '{"dragon_card":"HK","tiger_card":"D5","winner":"dragon"}', '龙赢 K>5', 45000.00, 42500.00, 2500.00, 12, datetime('now', '-45 minutes')),
('R20251129-0022', 'baccarat', 'BAC-A02', '{"banker_cards":["S9","C2"],"player_cards":["D6","H3"],"banker_point":1,"player_point":9,"winner":"player"}', '闲赢 9:1', 88000.00, 95000.00, -7000.00, 18, datetime('now', '-20 minutes')),
('R20251129-0025', 'baccarat', 'BAC-A01', '{"banker_cards":["H3","D3"],"player_cards":["S3","C3"],"banker_point":6,"player_point":6,"winner":"tie"}', '和局 6:6', 150000.00, 185000.00, -35000.00, 22, datetime('now', '-15 minutes'));

-- ============================================================================
-- 11. 洗码记录
-- ============================================================================
INSERT OR IGNORE INTO commission_records (player_id, agent_id, scheme_id, settle_date, baccarat_valid_bet, baccarat_rate, baccarat_amount, dragon_tiger_valid_bet, dragon_tiger_rate, dragon_tiger_amount, total_valid_bet, total_amount, status, created_at) VALUES
(1, 6, 3, date('now'), 2500000.00, 0.0100, 25000.00, 150000.00, 0.0100, 1500.00, 2650000.00, 26500.00, 0, datetime('now', '-2 hours')),
(2, 6, 2, date('now'), 1200000.00, 0.0080, 9600.00, 80000.00, 0.0080, 640.00, 1280000.00, 10240.00, 0, datetime('now', '-2 hours')),
(3, 7, 2, date('now'), 450000.00, 0.0080, 3600.00, 50000.00, 0.0080, 400.00, 500000.00, 4000.00, 2, datetime('now', '-2 hours')),
(4, 8, 1, date('now'), 35000.00, 0.0060, 210.00, 8000.00, 0.0060, 48.00, 43000.00, 258.00, 1, datetime('now', '-2 hours')),
(5, 8, 1, date('now', '-1 day'), 42000.00, 0.0060, 252.00, 0.00, 0.0060, 0.00, 42000.00, 252.00, 3, datetime('now', '-1 days'));

-- ============================================================================
-- 12. 红利发放记录
-- ============================================================================
INSERT OR IGNORE INTO bonus_records (order_no, player_id, bonus_type, amount, turnover_requirement, status, remark, operator_id, created_at) VALUES
('BON20251129001', 1, 'birthday', 8888.00, 8888.00, 1, 'VIP生日彩金', 1, datetime('now', '-3 hours')),
('BON20251129002', 11, 'first_deposit', 100.00, 300.00, 1, '首充100%赠送', NULL, datetime('now', '-6 hours')),
('BON20251129003', 3, 'activity', 2000.00, 2000.00, 0, '周末充值活动', NULL, datetime('now', '-30 minutes')),
('BON20251129004', 4, 'compensation', 500.00, 0.00, 1, '系统故障补偿', 6, datetime('now', '-1 days'));

-- ============================================================================
-- 13. 风控预警
-- ============================================================================
INSERT OR IGNORE INTO risk_alerts (player_id, alert_type, severity, title, description, related_data, status, created_at) VALUES
(1, 'large_bet', 2, '大额投注预警', '玩家 vip_whale_01 单注投注 ¥15,000，超过预警阈值', '{"bet_no":"BET20251129006","amount":15000}', 0, datetime('now', '-1 minutes')),
(2, 'high_odds_win', 3, '高赔率中奖预警', '玩家 vip_king_88 和局投注中奖，盈利 ¥40,000', '{"bet_no":"BET20251129004","win_amount":40000,"odds":8}', 0, datetime('now', '-15 minutes')),
(8, 'arb_suspect', 4, '套利嫌疑预警', '检测到高频投注行为，疑似套利', '{"ip":"203.0.113.88","bet_count_1h":25,"win_rate":0.72}', 0, datetime('now', '-20 minutes')),
(9, 'multi_account', 4, '多账户关联预警', '检测到同设备多账户登录', '{"device_id":"ABC123","related_users":["risk_user_99","blacklist_user"]}', 1, datetime('now', '-1 days')),
(NULL, 'table_risk', 3, '桌台爆台预警', 'BAC-A01 桌台近1小时派彩远超投注', '{"table_code":"BAC-A01","bet_total":500000,"payout_total":650000,"loss_rate":-30}', 0, datetime('now', '-10 minutes'));

-- ============================================================================
-- 14. 荷官档案 (V2.1新增)
-- ============================================================================
INSERT OR IGNORE INTO dealers (staff_id, stage_name_cn, stage_name_en, avatar_url, portrait_url, gender, hire_date, dealer_status, skills, rating) VALUES
('D001', '陈美丽', 'Alice', '/avatars/d001.jpg', '/portraits/d001.jpg', 0, '2023-01-15', 1, '["baccarat","dragon_tiger"]', 4.85),
('D002', '王强', 'Bob', '/avatars/d002.jpg', '/portraits/d002.jpg', 1, '2023-03-20', 1, '["baccarat","roulette"]', 4.72),
('D003', '李娜', 'Cici', '/avatars/d003.jpg', '/portraits/d003.jpg', 0, '2023-06-01', 2, '["baccarat","dragon_tiger"]', 4.90),
('D004', '刘芳', 'Emma', '/avatars/d004.jpg', '/portraits/d004.jpg', 0, '2024-01-10', 1, '["baccarat","sicbo"]', 4.68),
('D005', '张伟', 'David', '/avatars/d005.jpg', '/portraits/d005.jpg', 1, '2024-02-15', 1, '["roulette","sicbo"]', 4.55),
('D006', '赵雪', 'Grace', '/avatars/d006.jpg', '/portraits/d006.jpg', 0, '2024-05-01', 1, '["baccarat","niuniu"]', 4.80),
('D007', '周明', 'Henry', '/avatars/d007.jpg', '/portraits/d007.jpg', 1, '2024-06-15', 1, '["dragon_tiger","niuniu"]', 4.45),
('D008', '吴婷', 'Ivy', '/avatars/d008.jpg', '/portraits/d008.jpg', 0, '2024-08-01', 1, '["baccarat"]', 4.92);

-- ============================================================================
-- 15. 桌台配置 (V2.1新增)
-- ============================================================================
INSERT OR IGNORE INTO game_tables (table_code, table_name, game_type, primary_stream_url, backup_stream_url, limit_group_id, current_dealer_id, table_status, sort_order) VALUES
('BAC-A01', '百家乐A01厅', 'baccarat', 'wss://stream.example.com/bac-a01', 'https://flv.example.com/bac-a01.flv', 2, 1, 1, 1),
('BAC-A02', '百家乐A02厅', 'baccarat', 'wss://stream.example.com/bac-a02', 'https://flv.example.com/bac-a02.flv', 1, 4, 1, 2),
('BAC-A03', '百家乐A03厅', 'baccarat', 'wss://stream.example.com/bac-a03', 'https://flv.example.com/bac-a03.flv', 1, 8, 1, 3),
('DT-B01', '龙虎B01厅', 'dragon_tiger', 'wss://stream.example.com/dt-b01', 'https://flv.example.com/dt-b01.flv', 1, 2, 1, 4),
('DT-B02', '龙虎B02厅', 'dragon_tiger', 'wss://stream.example.com/dt-b02', 'https://flv.example.com/dt-b02.flv', 1, 7, 1, 5),
('ROU-C01', '轮盘C01厅', 'roulette', 'wss://stream.example.com/rou-c01', 'https://flv.example.com/rou-c01.flv', 1, 5, 1, 6),
('SIC-D01', '骰宝D01厅', 'sicbo', 'wss://stream.example.com/sic-d01', 'https://flv.example.com/sic-d01.flv', 1, NULL, 2, 7),
('NIU-E01', '牛牛E01厅', 'niuniu', 'wss://stream.example.com/niu-e01', 'https://flv.example.com/niu-e01.flv', 1, 6, 1, 8);

-- ============================================================================
-- 16. 排班数据 (V2.1新增)
-- ============================================================================
INSERT OR IGNORE INTO dealer_shifts (table_id, dealer_id, shift_date, shift_start_time, shift_end_time, status, has_conflict) VALUES
-- 今日排班
(1, 1, date('now'), datetime('now', 'start of day', '+8 hours'), datetime('now', 'start of day', '+12 hours'), 2, 0),
(1, 1, date('now'), datetime('now', 'start of day', '+14 hours'), datetime('now', 'start of day', '+18 hours'), 1, 0),
(2, 4, date('now'), datetime('now', 'start of day', '+8 hours'), datetime('now', 'start of day', '+14 hours'), 2, 0),
(2, 8, date('now'), datetime('now', 'start of day', '+14 hours'), datetime('now', 'start of day', '+20 hours'), 1, 0),
(4, 2, date('now'), datetime('now', 'start of day', '+10 hours'), datetime('now', 'start of day', '+16 hours'), 1, 0),
(5, 7, date('now'), datetime('now', 'start of day', '+12 hours'), datetime('now', 'start of day', '+18 hours'), 1, 0),
(6, 5, date('now'), datetime('now', 'start of day', '+14 hours'), datetime('now', 'start of day', '+22 hours'), 1, 0),
(8, 6, date('now'), datetime('now', 'start of day', '+16 hours'), datetime('now', 'start of day', '+22 hours'), 0, 0);

-- ============================================================================
-- 17. 内容管理
-- ============================================================================
INSERT OR IGNORE INTO contents (content_type, title, content, image_url, link_url, language, target_level, status, sort_order, publish_at) VALUES
('banner', '2025新春红利活动', '新春贺岁，充值送50%彩金！活动时间：1月20日-2月10日', '/banners/spring2025.jpg', '/activity/spring2025', 'zh-CN', 'all', 1, 1, datetime('now', '-7 days')),
('banner', 'VIP专属礼遇', 'VIP会员尊享专属返水与生日彩金', '/banners/vip.jpg', '/vip', 'zh-CN', 'vip_only', 1, 2, datetime('now', '-14 days')),
('marquee', '系统例行维护通知', '平台将于12月1日凌晨4:00-6:00进行系统维护，届时部分功能可能受影响，敬请谅解。', NULL, NULL, 'zh-CN', 'all', 2, 1, datetime('now', '+2 days')),
('marquee', '防诈骗温馨提示', '请勿轻信任何私人转账要求，官方客服不会索要密码。', NULL, NULL, 'zh-CN', 'all', 1, 2, datetime('now', '-30 days')),
('popup', 'VIP专属存款优惠', 'VIP会员专享：充值满10000送1888彩金！', '/popups/vip_bonus.jpg', '/deposit', 'zh-CN', 'vip_only', 1, 1, datetime('now', '-3 days')),
('game_rule', '百家乐游戏规则', '百家乐是一种流行的桌上游戏，玩家可以选择押注庄家(Banker)、闲家(Player)或和局(Tie)...', NULL, NULL, 'zh-CN', 'all', 1, 1, datetime('now', '-60 days')),
('game_rule', '龙虎游戏规则', '龙虎是一种简单快节奏的纸牌游戏，比较龙和虎两边的牌点大小...', NULL, NULL, 'zh-CN', 'all', 1, 2, datetime('now', '-60 days'));

-- ============================================================================
-- 18. 操作审计日志
-- ============================================================================
INSERT OR IGNORE INTO audit_logs (operator_id, operator_name, operator_role, module, action, target_type, target_id, old_value, new_value, description, ip_address, risk_level, created_at) VALUES
(1, 'admin_root', 'super_admin', 'commission', 'update_scheme', 'commission_scheme', '2', '{"baccarat_rate":0.0070}', '{"baccarat_rate":0.0080}', '修改VIP洗码方案百家乐返水比例', '192.168.10.5', 2, datetime('now', '-1 hours')),
(2, 'finance_lead', 'finance', 'withdraw', 'approve', 'withdraw_request', '5', '{"status":0}', '{"status":4}', '审核通过提款申请 WDR20251128001', '10.20.1.101', 1, datetime('now', '-1 days')),
(4, 'risk_manager', 'risk', 'player', 'freeze', 'player', '7', '{"status":0}', '{"status":1}', '冻结可疑账户 frozen_user_01', '203.0.113.5', 2, datetime('now', '-2 days')),
(4, 'risk_manager', 'risk', 'player', 'blacklist', 'player', '9', '{"risk_level":3}', '{"risk_level":4,"status":2}', '将套利账户加入黑名单', '203.0.113.5', 3, datetime('now', '-1 days')),
(6, 'cs_manager', 'customer_service', 'finance', 'manual_adjust', 'player', '4', '{"balance":8000}', '{"balance":8500,"remark":"活动补偿"}', '人工调整余额 +500', '172.16.0.100', 2, datetime('now', '-3 hours'));

-- ============================================================================
-- 19. 系统配置
-- ============================================================================
INSERT OR IGNORE INTO system_configs (config_group, config_key, config_value, value_type, description, is_public) VALUES
('site', 'site_name', '真人荷官视讯', 'string', '站点名称', 1),
('site', 'site_logo', '/logo.png', 'string', '站点Logo', 1),
('finance', 'deposit_min', '100', 'number', '最低充值金额', 1),
('finance', 'deposit_max', '500000', 'number', '最高单笔充值金额', 1),
('finance', 'withdraw_min', '100', 'number', '最低提款金额', 1),
('finance', 'withdraw_max', '200000', 'number', '最高单笔提款金额', 1),
('finance', 'withdraw_daily_limit', '3', 'number', '每日提款次数限制', 0),
('finance', 'turnover_multiplier', '1', 'number', '流水倍数要求', 0),
('risk', 'large_bet_threshold', '20000', 'number', '大额投注预警阈值', 0),
('risk', 'high_frequency_threshold', '20', 'number', '高频投注预警(每小时)', 0),
('commission', 'auto_payout_threshold', '1000', 'number', '洗码自动发放阈值', 0),
('commission', 'settlement_time', '04:00', 'string', '每日结算时间', 0),
('security', '2fa_required', '1', 'boolean', '是否强制2FA认证', 0),
('security', 'session_timeout', '3600', 'number', '会话超时时间(秒)', 0),
('security', 'login_fail_limit', '5', 'number', '登录失败锁定次数', 0);

-- ============================================================================
-- 20. 收款方式设置
-- ============================================================================
INSERT OR IGNORE INTO payment_methods (method_code, method_name, method_type, currency, min_amount, max_amount, fee_rate, fee_fixed, account_info, instructions, status, sort_order) VALUES
('BANK_ICBC', '工商银行', 'bank', 'CNY', 100, 500000, 0, 0, '{"bank_name":"中国工商银行","account_name":"XXX公司","account_no":"6222021234567890123","branch":"XX支行"}', '请使用网银或手机银行转账，备注您的会员账号', 1, 1),
('BANK_CCB', '建设银行', 'bank', 'CNY', 100, 500000, 0, 0, '{"bank_name":"中国建设银行","account_name":"XXX公司","account_no":"6227001234567890123","branch":"XX支行"}', '请使用网银或手机银行转账，备注您的会员账号', 1, 2),
('BANK_ABC', '农业银行', 'bank', 'CNY', 100, 300000, 0, 0, '{"bank_name":"中国农业银行","account_name":"XXX公司","account_no":"6228481234567890123","branch":"XX支行"}', '请使用网银或手机银行转账，备注您的会员账号', 1, 3),
('ALIPAY', '支付宝', 'ewallet', 'CNY', 50, 50000, 0, 0, '{"account":"alipay@example.com","name":"XXX"}', '扫码支付或转账至支付宝账户', 1, 4),
('WECHAT', '微信支付', 'ewallet', 'CNY', 50, 50000, 0, 0, '{"account":"wxid_example"}', '扫码支付', 1, 5),
('USDT_TRC20', 'USDT-TRC20', 'crypto', 'USDT', 10, 1000000, 0.01, 0, '{"network":"TRC20","address":"TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}', 'TRC20网络转账，确认后约5分钟到账', 1, 6),
('USDT_ERC20', 'USDT-ERC20', 'crypto', 'USDT', 50, 1000000, 0.01, 0, '{"network":"ERC20","address":"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}', 'ERC20网络转账，Gas费较高，建议大额使用', 1, 7),
('BTC', '比特币', 'crypto', 'BTC', 0.001, 100, 0, 0, '{"network":"BTC","address":"bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}', 'BTC主网转账，约6个确认后到账', 0, 8),
('ETH', '以太坊', 'crypto', 'ETH', 0.01, 1000, 0, 0, '{"network":"ETH","address":"0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}', 'ETH主网转账', 0, 9),
('UNIONPAY', '银联快捷', 'quickpay', 'CNY', 100, 100000, 0.006, 0, NULL, '支持大部分银行卡快捷支付', 1, 10);

-- ============================================================================
-- 21. 玩家在线状态
-- ============================================================================
INSERT OR IGNORE INTO player_sessions (player_id, session_id, current_table_code, current_game_type, login_ip, device_type, is_online, last_active_at) VALUES
(1, 'sess_vip_whale_01_001', 'BAC-A01', 'baccarat', '202.96.134.5', 'pc', 1, datetime('now', '-30 seconds')),
(2, 'sess_vip_king_88_001', 'BAC-A01', 'baccarat', '116.228.111.8', 'pc', 1, datetime('now', '-1 minutes')),
(3, 'sess_vip_player_01_001', 'DT-B01', 'dragon_tiger', '192.168.1.102', 'h5', 1, datetime('now', '-2 minutes')),
(4, 'sess_normal_player_01_001', NULL, NULL, '180.163.100.5', 'h5', 1, datetime('now', '-5 minutes')),
(8, 'sess_risk_user_99_001', 'BAC-A02', 'baccarat', '203.0.113.88', 'pc', 1, datetime('now', '-1 minutes'));

-- ============================================================================
-- 收款方式配置 (V2.1新增)
-- ============================================================================
INSERT OR IGNORE INTO payment_methods (method_code, method_name, method_type, currency, min_amount, max_amount, fee_rate, fee_fixed, account_info, instructions, status, sort_order) VALUES
('BANK_ICBC', '工商银行', 'bank', 'CNY', 100, 500000, 0, 0, '{"bank":"工商银行","account":"6222 **** **** 8888","holder":"公司收款户"}', '请使用网银或手机银行转账，备注您的用户名', 1, 1),
('BANK_CCB', '建设银行', 'bank', 'CNY', 100, 500000, 0, 0, '{"bank":"建设银行","account":"6227 **** **** 6666","holder":"公司收款户"}', '请使用网银或手机银行转账，备注您的用户名', 1, 2),
('BANK_BOC', '中国银行', 'bank', 'CNY', 100, 500000, 0, 0, '{"bank":"中国银行","account":"6217 **** **** 4444","holder":"公司收款户"}', '请使用网银或手机银行转账', 1, 3),
('ALIPAY', '支付宝', 'ewallet', 'CNY', 50, 50000, 0, 0, '{"account":"company@alipay.com","qr_code":"/static/qr/alipay.png"}', '扫码或转账至支付宝账户', 1, 4),
('WECHAT', '微信支付', 'ewallet', 'CNY', 50, 50000, 0, 0, '{"qr_code":"/static/qr/wechat.png"}', '扫码支付', 1, 5),
('USDT_TRC20', 'USDT-TRC20', 'crypto', 'USDT', 10, 100000, 0, 0, '{"address":"TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW8","network":"TRC20"}', '请确保选择TRC20网络转账，1USDT≈7.2CNY', 1, 6),
('USDT_ERC20', 'USDT-ERC20', 'crypto', 'USDT', 100, 100000, 0.001, 0, '{"address":"0x1234...abcd","network":"ERC20"}', '请确保选择ERC20网络转账', 1, 7),
('QUICKPAY_01', '银联快捷', 'quickpay', 'CNY', 100, 30000, 0, 0, NULL, '选择银行卡快捷支付', 1, 8);

-- 添加额外的玩家在线会话数据
INSERT OR IGNORE INTO player_sessions (player_id, session_id, current_table_code, current_game_type, login_ip, device_type, is_online, last_active_at) VALUES
(1, 'sess_001', 'A01', 'baccarat', '202.96.134.5', 'desktop', 1, datetime('now')),
(2, 'sess_002', 'B02', 'dragon_tiger', '116.228.111.8', 'mobile', 1, datetime('now', '-5 minutes')),
(3, 'sess_003', NULL, NULL, '192.168.1.102', 'desktop', 0, datetime('now', '-2 hours')),
(4, 'sess_004', 'A03', 'baccarat', '180.163.100.5', 'mobile', 1, datetime('now', '-3 minutes')),
(5, 'sess_005', NULL, NULL, '61.129.65.8', 'desktop', 0, datetime('now', '-1 day'));
