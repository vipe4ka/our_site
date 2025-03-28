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
INSERT INTO file_types (file_type_id, type_name) VALUES
(1, 'jpg'),
(2, 'pptx'),
(3, 'pdf'),
(4, 'txt'),
(5, 'mp4'),
(6, 'xlsx'),
(7, 'rar');
SELECT * FROM file_types;
INSERT INTO users (user_id, nickname, email, encrypted_password, registration_date, files_visibility) VALUES
(1, 'petrov_ivan', 'ivan@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
(2, 'vasilyeva_anna', 'anna@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'private'),
(3, 'ivanov_alex', 'alex@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
(4, 'kotova_maria', 'maria@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
(5, 'zel_ivan', 'david@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'private'),
(6, 'belolga', 'olga@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'public'),
(7, 'fedsergey', 'sergey@example.com', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e', CURRENT_TIMESTAMP, 'private');
SELECT * FROM users;
INSERT INTO files (file_id, file_name, file_type_id, file_size, owner_id, file_path, upload_date) VALUES
(1, 'vacation_photo.jpg', 1, 2456789, 1, '/uploads/1/vacation_photo.jpg', CURRENT_TIMESTAMP),
(2, 'report.pdf', 3, 1234567, 2, '/uploads/2/report.pdf', CURRENT_TIMESTAMP),
(3, 'presentation.pptx', 2, 3456789, 3, '/uploads/3/presentation.pptx', CURRENT_TIMESTAMP),
(4, 'notes.txt', 4, 1024, 4, '/uploads/4/notes.txt', CURRENT_TIMESTAMP),
(5, 'budget.xlsx', 6, 2345678, 5, '/uploads/5/budget.xlsx', CURRENT_TIMESTAMP),
(6, 'movie.mp4', 5, 123456789, 6, '/uploads/7/movie.mp4', CURRENT_TIMESTAMP),
(7, 'project.rar', 7, 3456789, 7, '/uploads/9/project.rar', CURRENT_TIMESTAMP);
SELECT * FROM files;
INSERT INTO download_audit (audit_id, file_id, file_owner_id, downloader_id, download_time) VALUES
(1, 1, 1, 2, CURRENT_TIMESTAMP),
(2, 2, 2, 1, CURRENT_TIMESTAMP),
(3, 3, 3, 4, CURRENT_TIMESTAMP),
(4, 4, 4, 3, CURRENT_TIMESTAMP),
(5, 5, 5, 6, CURRENT_TIMESTAMP),
(6, 6, 6, 5, CURRENT_TIMESTAMP),
(7, 7, 7, 7, CURRENT_TIMESTAMP);
SELECT * FROM download_audit;

-- Вывод всех персональных страниц
SELECT * FROM personal_pages_info;

-- Проверка доверенного источника
SELECT  u.nickname AS profile_owner, check_trusted_source(1, u.user_id) AS is_trusted_for_user_2 FROM users u;

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
        INSERT INTO users (nickname, email, encrypted_password, registration_date, files_visibility)
        VALUES (p_nickname, p_email, p_password, CURRENT_TIMESTAMP, 'public');
        -- Возвращаем информацию о добавленном пользователе
        SELECT 'User successfully added' AS message, user_id, nickname, email, registration_date
        FROM users
        WHERE user_id = LAST_INSERT_ID();
    END IF;
END //
DELIMITER ;
CALL add_new_user('mih_mih', 'new_user@example.com', '$2a$10$hashedpassword123');

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
DELIMITER ;
-- Проверка нескольких email
SELECT email, user_exists_by_email(email) AS is_registered
FROM (SELECT 'ivan@example.com' AS email UNION SELECT 'unknown@test.com') t;

-- Булевая функция поиска юзера по нику и паролю
DELIMITER //
CREATE FUNCTION authenticate_user(
    p_nickname VARCHAR(50),
    p_password VARCHAR(255))
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users
        WHERE nickname = p_nickname 
        AND encrypted_password = p_password);
END //
DELIMITER ;

-- Проверка существования пользователя
SELECT authenticate_user('petrov_ivan', '$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e') AS auth_result;

-- Процедура поиска пользователя по никнейму
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