PRAGMA foreign_keys = ON;

-- Tạo bảng dữ liệu
CREATE TABLE IF NOT EXISTS account_types (
    account_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,      -- 'money', 'data', 'call'
    name TEXT NOT NULL,             -- "Tiền", "Data", "Phút gọi"
    unit TEXT NOT NULL              -- 'VND', 'GB', 'phút'
);

CREATE TABLE IF NOT EXISTS allocation_policies (
    allocation_policy_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL       -- VD: 'ST120K default allocation'
);

CREATE TABLE IF NOT EXISTS allocation_policy_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    allocation_policy_id INTEGER NOT NULL,
    account_type_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (allocation_policy_id) REFERENCES allocation_policies(allocation_policy_id) ON DELETE CASCADE,
    FOREIGN KEY (account_type_id) REFERENCES account_types(account_type_id)
);

CREATE TABLE IF NOT EXISTS packages (
    package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    price REAL NOT NULL,
    allocation_policy_id INTEGER NOT NULL,
    FOREIGN KEY (allocation_policy_id) REFERENCES allocation_policies(allocation_policy_id)
);

-- Thêm dữ liệu
INSERT INTO account_types (code, name, unit) VALUES
('money', 'Tài khoản tiền', 'VND'),
('data', 'Tài khoản data', 'GB'),
('call', 'Tài khoản phút gọi', 'phút');

INSERT INTO allocation_policies (name) VALUES ('ST120K default allocation');

-- Giả sử account_type_id: money=1, data=2, call=3
INSERT INTO allocation_policy_details (allocation_policy_id, account_type_id, amount) VALUES
(1, 2, 1.0),   -- 1GB data 
(1, 3, 50);    -- 50 phút gọi

INSERT INTO allocation_policies (name) VALUES ('ST150K default allocation');

INSERT INTO allocation_policy_details (allocation_policy_id, account_type_id, amount) VALUES
(2, 2, 2.0),   -- 2GB data
(2, 3, 100);   -- 100 phút gọi

INSERT INTO allocation_policies (name) VALUES ('ST200K default allocation');

INSERT INTO allocation_policy_details (allocation_policy_id, account_type_id, amount) VALUES
(3, 2, 3.0),
(3, 3, 150);

-- Gói ST120K
INSERT INTO packages (name, price, allocation_policy_id)
VALUES ('ST120K', 120000, 1);

-- ST150K dùng allocation khác
INSERT INTO packages (name, price, allocation_policy_id)
VALUES ('ST150K', 150000, 2);

-- ST200K
INSERT INTO packages (name, price, allocation_policy_id)
VALUES ('ST200K', 200000, 3);
