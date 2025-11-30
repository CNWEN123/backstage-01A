-- 生成转账记录测试数据

-- 1. 普通转账（已完成）
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500001', 1, 2, 5000.00, 100.00, 4900.00, 'completed', datetime('now', '-5 days'), datetime('now', '-5 days'), 1),
('TRF20251130050500002', 2, 3, 3000.00, 60.00, 2940.00, 'completed', datetime('now', '-4 days'), datetime('now', '-4 days'), 1),
('TRF20251130050500003', 3, 1, 8000.00, 80.00, 7920.00, 'completed', datetime('now', '-3 days'), datetime('now', '-3 days'), 1);

-- 2. VIP会员转账（优惠费率）
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500004', 4, 5, 20000.00, 100.00, 19900.00, 'completed', datetime('now', '-2 days'), datetime('now', '-2 days'), 1),
('TRF20251130050500005', 5, 6, 15000.00, 75.00, 14925.00, 'completed', datetime('now', '-1 days'), datetime('now', '-1 days'), 1);

-- 3. 小额转账（固定手续费）
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500006', 1, 3, 500.00, 5.00, 495.00, 'completed', datetime('now', '-12 hours'), datetime('now', '-12 hours'), 1),
('TRF20251130050500007', 2, 4, 800.00, 5.00, 795.00, 'completed', datetime('now', '-10 hours'), datetime('now', '-10 hours'), 1);

-- 4. 待处理的转账
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at)
VALUES 
('TRF20251130050500008', 3, 5, 12000.00, 120.00, 11880.00, 'pending', datetime('now', '-2 hours')),
('TRF20251130050500009', 4, 6, 25000.00, 250.00, 24750.00, 'pending', datetime('now', '-1 hours')),
('TRF20251130050500010', 5, 1, 6000.00, 60.00, 5940.00, 'pending', datetime('now', '-30 minutes'));

-- 5. 已取消的转账（使用cancelled而不是rejected）
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, remark, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500011', 1, 2, 50000.00, 500.00, 49500.00, 'cancelled', '金额过大，需要额外验证', datetime('now', '-6 days'), datetime('now', '-6 days'), 1),
('TRF20251130050500012', 2, 3, 100000.00, 1000.00, 99000.00, 'cancelled', '超出单日转账限额', datetime('now', '-5 days'), datetime('now', '-5 days'), 1);

-- 6. 大额转账（已完成）
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500013', 6, 1, 30000.00, 300.00, 29700.00, 'completed', datetime('now', '-8 hours'), datetime('now', '-8 hours'), 1),
('TRF20251130050500014', 1, 4, 18000.00, 180.00, 17820.00, 'completed', datetime('now', '-6 hours'), datetime('now', '-6 hours'), 1),
('TRF20251130050500015', 2, 5, 22000.00, 220.00, 21780.00, 'completed', datetime('now', '-4 hours'), datetime('now', '-4 hours'), 1);

-- 7. 今天的转账记录
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500016', 3, 6, 4500.00, 90.00, 4410.00, 'completed', datetime('now', '-3 hours'), datetime('now', '-3 hours'), 1),
('TRF20251130050500017', 4, 2, 7500.00, 75.00, 7425.00, 'completed', datetime('now', '-2 hours'), datetime('now', '-2 hours'), 1),
('TRF20251130050500018', 5, 3, 10000.00, 100.00, 9900.00, 'completed', datetime('now', '-1 hours'), datetime('now', '-1 hours'), 1);

-- 8. 更多待处理转账（用于测试审核功能）
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at)
VALUES 
('TRF20251130050500019', 6, 4, 3500.00, 70.00, 3430.00, 'pending', datetime('now', '-20 minutes')),
('TRF20251130050500020', 1, 5, 9500.00, 95.00, 9405.00, 'pending', datetime('now', '-10 minutes'));

-- 9. VIP高额转账
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, remark, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500021', 4, 6, 45000.00, 450.00, 44550.00, 'completed', 'VIP会员大额转账', datetime('now', '-7 days'), datetime('now', '-7 days'), 1),
('TRF20251130050500022', 5, 4, 35000.00, 350.00, 34650.00, 'completed', 'VIP会员转账', datetime('now', '-6 days'), datetime('now', '-6 days'), 1);

-- 10. 跨VIP等级转账
INSERT INTO transfer_records (order_no, from_player_id, to_player_id, amount, fee, actual_amount, status, created_at, reviewed_at, reviewed_by)
VALUES 
('TRF20251130050500023', 1, 6, 2500.00, 50.00, 2450.00, 'completed', datetime('now', '-9 hours'), datetime('now', '-9 hours'), 1),
('TRF20251130050500024', 6, 2, 4200.00, 42.00, 4158.00, 'completed', datetime('now', '-7 hours'), datetime('now', '-7 hours'), 1),
('TRF20251130050500025', 3, 4, 6800.00, 68.00, 6732.00, 'completed', datetime('now', '-5 hours'), datetime('now', '-5 hours'), 1);

