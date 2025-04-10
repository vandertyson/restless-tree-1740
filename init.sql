-- Create books table if it doesn't exist
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    genre VARCHAR(50) DEFAULT 'Unknown',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Insert books data with consolidated genres
INSERT INTO books (id, title, author, description, image_url, genre) VALUES
(1, 'The Brothers Karamazov', 'Fyodor Dostoevsky', 'A passionate philosophical novel set in 19th-century Russia, which explores ethical debates of God, free will, and morality.', '/images/books/brothers-karamazov.jpg', 'Literary Fiction'),
(2, 'East of Eden', 'John Steinbeck', 'A multigenerational family saga set in the Salinas Valley, California, exploring themes of good and evil through the intertwined stories of two families.', '/images/books/east-of-eden.jpg', 'Literary Fiction'),
(3, 'The Fifth Season', 'N.K. Jemisin', 'Set in a world where catastrophic climate change occurs regularly, this novel follows a woman searching for her daughter while navigating a society divided by powers.', '/images/books/fifth-season.jpg', 'Science Fiction & Fantasy'),
(4, 'Jane Eyre', 'Charlotte Brontë', 'A novel about a strong-willed orphan who becomes a governess, falls in love with her employer, and discovers his dark secret.', '/images/books/jane-eyre.jpg', 'Literary Fiction'),
(5, 'Anna Karenina', 'Leo Tolstoy', 'A complex novel of family life among the Russian aristocracy, focusing on an adulterous affair between Anna Karenina and Count Vronsky.', '/images/books/anna-karenina.jpg', 'Literary Fiction'),
(6, 'Giovanni''s Room', 'James Baldwin', 'A groundbreaking novel that follows an American man living in Paris as he grapples with his sexual identity and relationships.', '/images/books/giovannis-room.jpg', 'Historical Fiction'),
(7, 'My Brilliant Friend', 'Elena Ferrante', 'The first novel in the Neapolitan quartet that traces the friendship between Elena and Lila, from their childhood in a poor Naples neighborhood through their diverging paths in life.', '/images/books/my-brilliant-friend.jpg', 'Literary Fiction'),
(8, 'The Remains of the Day', 'Kazuo Ishiguro', 'The story of an English butler reflecting on his life of service and missed opportunities as he takes a road trip through the countryside.', '/images/books/remains-of-the-day.jpg', 'Historical Fiction'),
(9, 'The Left Hand of Darkness', 'Ursula K. Le Guin', 'A science fiction novel that follows an envoy sent to convince the ambisexual people of the planet Gethen to join an interplanetary collective.', '/images/books/left-hand-of-darkness.jpg', 'Science Fiction & Fantasy');


--Tao bang du lieu
CREATE TABLE IF NOT EXISTS account_types (
    account_type_id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,  -- 'money', 'data', 'call'
    name VARCHAR(100) NOT NULL,        -- "Tiền", "Data", "Phút gọi"
    unit VARCHAR(20) NOT NULL          -- 'VND', 'GB', 'phút'
);

CREATE TABLE IF NOT EXISTS allocation_policies (
    allocation_policy_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL -- VD: 'ST120K default allocation'
);

CREATE TABLE IF NOT EXISTS allocation_policy_details (
    id SERIAL PRIMARY KEY,
    allocation_policy_id INT REFERENCES allocation_policies(allocation_policy_id) ON DELETE CASCADE,
    account_type_id INT REFERENCES account_types(account_type_id),
    amount NUMERIC(12, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS overuse_policies (
    overuse_policy_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL -- VD: 'ST120K overuse'
);

CREATE TABLE IF NOT EXISTS overuse_policy_details (
    id SERIAL PRIMARY KEY,
    overuse_policy_id INT REFERENCES overuse_policies(overuse_policy_id) ON DELETE CASCADE,
    account_type_id INT REFERENCES account_types(account_type_id),
    price_per_unit NUMERIC(10, 2) NOT NULL -- VND / đơn vị
);

CREATE TABLE IF NOT EXISTS packages (
    package_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    allocation_policy_id INT REFERENCES allocation_policies(allocation_policy_id),
    overuse_policy_id INT REFERENCES overuse_policies(overuse_policy_id)
);

--Insert du lieu
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


INSERT INTO overuse_policies (name) VALUES ('Default Overuse Policy A');

-- Giả sử overuse_policy_id = 1
INSERT INTO overuse_policy_details (overuse_policy_id, account_type_id, price_per_unit) VALUES
(1, 2, 5000),   -- data: 5,000 VND/MB
(1, 3, 3000);   -- call: 3,000 VND/phút

-- ST120K
INSERT INTO packages (name, price, allocation_policy_id, overuse_policy_id)
VALUES ('ST120K', 120000, 1, 1);

-- ST150K dùng allocation khác nhưng vẫn reuse chính sách trừ của ST120K
INSERT INTO packages (name, price, allocation_policy_id, overuse_policy_id)
VALUES ('ST150K', 150000, 2, 1);

-- ST200K cũng reuse overuse_policy_id = 1
INSERT INTO packages (name, price, allocation_policy_id, overuse_policy_id)
VALUES ('ST200K', 200000, 3, 1);
