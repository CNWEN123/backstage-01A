-- 创建管理员账号 (密码: Qwer@1234)
INSERT INTO admins (username, password_hash, nickname, role, permissions, status) 
VALUES ('admin', 'Qwer@1234', '超级管理员', 'super_admin', '["*"]', 1);

-- 创建股东账号
INSERT INTO agents (agent_username, password_hash, nickname, level, share_ratio, commission_ratio, status)
VALUES ('shareholder01', 'Qwer@1234', '股东01', 'shareholder', 0.5, 0.1, 1);

-- 创建代理账号
INSERT INTO agents (agent_username, password_hash, nickname, level, share_ratio, commission_ratio, status)
VALUES ('agent01', 'Qwer@1234', '代理01', 'agent', 0.3, 0.05, 1);
