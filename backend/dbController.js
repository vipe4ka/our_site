import mysql from "mysql2/promise";

export class DbController {
    connection = null;

    async connect() {
        this.connection = await mysql.createConnection({
            host: "localhost",      // Адрес сервера MySQL
            user: "root",  // Имя пользователя MySQL
            password: "root",  // Пароль пользователя MySQL /(your_secure_password)
            database: "fileserver"  // Название базы данных
        });
    }

    async execute(query, params = []) {
        try {
            const [result] = await this.connection.execute(query, [...params]);
            return result;
        } catch (error) {
            console.error('Database error:', error);
            throw error;
        }
    }

    // Проверяем существует ли пользователя по почте
    async userByEmail(email) {
        const result = await this.execute(`SELECT user_by_email(?) as "username"`, [email]);
        return result[0].username;
    }

    // Проверяем уникальность никнейма
    async uniqueNickname(nickname) {
        const result = await this.execute(`SELECT uni_nickname(?) as "exists"`, [nickname]);
        return result[0].exists;
    }

    // Добавляем нового пользователя
    async addNewUser(nickname, email, password) {
        const result = await this.execute(`CALL add_new_user(?, ?, ?)`, [nickname, email, password]);
        return result[0].exists;
    }

    // Проверяем пароль пользователя
    async authenticateUser(email) {
        const result = await this.execute(`SELECT authenticate_user(?) as "password_hash"`, [email]);
        return result[0].password_hash;
    }

    async addNewFileToUser(file_name, owner_username) {
        const result = await this.execute(`INSERT INTO files (file_name, owner_username) VALUES (?, ?);`, [file_name, owner_username]);
        return true;
    }

    async deleteFileFromUser(file_id) {
        const result = await this.execute(`SELECT del_file_by_id(?) as file_name;`, [file_id]);
        return result[0].file_name;
    }

    async changeFileVisibility(file_id, new_file_visibility) {
        await this.execute(`UPDATE files SET file_visibility = ? WHERE file_id = ?;`, [new_file_visibility, file_id]);
    }

    // Выдаем файлы юзера
    async getUserFiles(username, with_invisible = false, file_ides = null) {
        let query = `SELECT file_id, file_name, file_visibility\
            FROM files\
            WHERE owner_username = ?\
            AND file_visibility in (1, ?)`;
        if (file_ides) {
            query += ` AND file_id in (${file_ides.join(', ')});`;
        } else {
            query += `;`;
        }
        const result = await this.execute(query, [username, !with_invisible]);
        return result || [];
    }

    // Выдаем имена юзеров с количеством файлов
    async getAllUsernamesWithFilecounts() {
        const result = await this.execute(`SELECT u.nickname, COUNT(f.file_id) AS fcounts\
                FROM users u\
                LEFT JOIN files f ON u.nickname = f.owner_username AND f.file_visibility = 1\
                GROUP BY u.nickname;`);
        return result;
    }
}

// База данных
export const dbController = new DbController();
// Конектимся к базе..
dbController.connect();