-- Создание базы данных
CREATE DATABASE IF NOT EXISTS file_sharing;
USE file_sharing;

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
    files_visibility ENUM('public', 'private') DEFAULT 'public',
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

-- Персональные страницы
CREATE VIEW personal_pages_info AS
SELECT 
	user_id,
	nickname,
	registration_date,
	files_visibility
FROM users 
GROUP BY user_id;

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
('petrov_ivan', 'ivan@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
('vasilyeva_anna', 'anna@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'private'),
('ivanov_alex', 'alex@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
('kotova_maria', 'maria@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
('zel_ivan', 'david@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'private'),
('belolga', 'olga@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
('fedsergey', 'sergey@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'private');

-- Вывод всех персональных страниц
SELECT * FROM personal_pages_info;

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
CREATE FUNCTION user_exists_by_email(p_email VARCHAR(100)) 
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE user_count INT;
    
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE email = p_email;
    
    RETURN user_count > 0;
END //
DELIMITER 

-- Булевая функция поиска юзера по почте и паролю
DELIMITER //
CREATE FUNCTION authenticate_user(
    p_email VARCHAR(50),
    p_password VARCHAR(255))
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users
        WHERE email = p_email
        AND encrypted_password = p_password);
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