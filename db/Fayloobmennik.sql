-- Создание базы данных
CREATE DATABASE IF NOT EXISTS fileserver;
USE fileserver;

-- Таблица типов файлов
CREATE TABLE file_types (
    file_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL
);

-- Таблица пользователей
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    encrypted_password VARCHAR(255) NOT NULL,
    registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    files_visibility BOOLEAN DEFAULT 1 COMMENT '0 - private, 1 - public',
    deletion_date DATETIME DEFAULT NULL
);

-- Таблица файлов
CREATE TABLE files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type_id INT NOT NULL,
    file_size BIGINT NOT NULL,
    owner_id INT NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    upload_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_type_id) REFERENCES file_types(file_type_id),
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

-- Таблица аудита скачиваний (с информацией о владельце и скачивающем)
CREATE TABLE download_audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT NOT NULL,
    file_owner_id INT NOT NULL,  -- Владелец файла
    downloader_id INT NOT NULL,   -- Кто скачал
    download_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(file_id),
    FOREIGN KEY (file_owner_id) REFERENCES users(user_id),
    FOREIGN KEY (downloader_id) REFERENCES users(user_id)
);

-- Представление для информации о пользователе
CREATE VIEW personal_pages_info AS
SELECT 
    user_id,
    nickname,
    email,
    registration_date,
    files_visibility
FROM users
WHERE deletion_date IS NULL;

-- Представление для информации о файлах пользователя
CREATE VIEW user_files_info AS
SELECT 
    f.owner_id AS user_id,
    f.file_id,
    f.file_name,
    ft.type_name AS file_type,
    f.file_size,
    f.upload_date,
    f.file_path
FROM files f
JOIN file_types ft ON f.file_type_id = ft.file_type_id;

-- Функция проверки доверенного источника
DELIMITER //
CREATE FUNCTION check_trusted_source(p_viewer_id INT, p_profile_user_id INT)
RETURNS BOOL
READS SQL DATA
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM download_audit
        WHERE file_owner_id = p_profile_user_id
        AND downloader_id = p_viewer_id
    );
END //
DELIMITER ;

INSERT INTO file_types (type_name) VALUES
('Picture'),
('Microsoft Office'),
('PDF'),
('TXT'),
('Audio'),
('Video'),
('Archive'),
('Executable'),
('Other');

INSERT INTO users (nickname, email, encrypted_password, registration_date, files_visibility) VALUES
('petrov_ivan', 'ivan@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 1),
('vasilyeva_anna', 'anna@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 0),
('ivanov_alex', 'alex@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 1),
('kotova_maria', 'maria@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 1),
('zel_ivan', 'david@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 0),
('belolga', 'olga@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 1),
('fedsergey', 'sergey@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 0);

-- Процедура добавления пользователя
DELIMITER //
CREATE PROCEDURE add_new_user(
    IN p_nickname VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_count INT;
    -- Проверка на существование пользователя с таким же nickname или email
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE nickname = p_nickname OR email = p_email;
    
    IF user_count > 0 THEN
        -- Пользователь уже существует
        SELECT 'Error: User with this nickname or email already exists' AS message;
    ELSE
        -- Добавление нового пользователя
        INSERT INTO users (nickname, email, encrypted_password, registration_date)
        VALUES (p_nickname, p_email, p_password, CURRENT_TIMESTAMP);
        -- Возвращаем информацию о добавленном пользователе
        SELECT 'User successfully added' AS message, user_id, nickname, email, registration_date
        FROM users
        WHERE user_id = LAST_INSERT_ID();
    END IF;
END //
DELIMITER ;

-- Булевая функция поиска юзера по почте
DELIMITER //
CREATE FUNCTION user_by_email(p_email VARCHAR(100)) 
RETURNS TEXT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE user TEXT;
    
    SELECT nickname INTO user
    FROM users
    WHERE email = p_email;
    
    RETURN user;
END //
DELIMITER ;

-- Аутентификация
DELIMITER //
CREATE FUNCTION authenticate_user(
    p_email VARCHAR(50))
RETURNS varchar(255)
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN (
        SELECT encrypted_password
        FROM users
        WHERE email = p_email
	);
END //
DELIMITER ;

-- Функция поиска пользователя по никнейму
DELIMITER //
CREATE FUNCTION uni_nickname(
    p_nickname VARCHAR(50))
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users
        WHERE nickname = p_nickname);
END //
DELIMITER ;