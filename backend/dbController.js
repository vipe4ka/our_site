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

    // Проверяем существует ли пользователя по почте
    async userByEmail(email) {
        try {
            const [result] = await this.connection.execute(`SELECT user_by_email(?) as "username"`, [email]);
            return result[0].username;
        } catch (error) {
            throw error;
        }
    }

    // Проверяем уникальность никнейма
    async uniqueNickname(nickname) {
        try {
            const [result] = await this.connection.execute(`SELECT uni_nickname(?) as "exists"`, [nickname]);
            return result[0].exists;
        } catch (error) {
            throw error;
        }
    }

    // Добавляем нового пользователя
    async addNewUser(nickname, email, password) {
        try {
            const [result] = await this.connection.execute(`CALL add_new_user(?, ?, ?)`, [nickname, email, password]);
            return result[0].exists;
        } catch (error) {
            throw error;
        }
    }

    // Проверяем пароль пользователя
    async authenticateUser(email, password) {
        try {
            const [result] = await this.connection.execute(`SELECT authenticate_user(?) as "password_hash"`, [email]);
            return result[0].password_hash;
        } catch (error) {
            throw error;
        }
    }

    async addNewFileToUser(file_name, owner_username) {
        try {
            await this.connection.execute(`INSERT INTO files (file_name, owner_username) VALUES (?, ?);`, [file_name, owner_username]);
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Выдаем файлы юзера
    async getUserFiles(username, withInvisible=false) {
        try {
            const [result] = await this.connection.execute(`CALL get_files_by_user(?, ?)`, [username, withInvisible]);
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    // Выдаем имена юзеров с количеством файлов
    async getAllUsernamesWithFilecounts() {
        try {
            const [result] = await this.connection.execute(`SELECT owner_username as nickname, count(*) as fcounts from files where file_visibility = 1 group by owner_username`);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

// База данных
export const dbController = new DbController();
// Конектимся к базе..
dbController.connect();