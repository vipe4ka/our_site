import mysql from "mysql2/promise";

export class DbController {
    connection = null;
    
    async connect() {
        this.connection = await mysql.createConnection({
                    host: "localhost",      // Адрес сервера MySQL
                    user: "root",  // Имя пользователя MySQL
                    password: "root",  // Пароль пользователя MySQL
                    database: "fileserver"  // Название базы данных
                });
    }

    // Проверяем существует ли пользователя по почте
    async userExistsByEmail(email) {
        try {
            const [result] = await this.connection.execute(`SELECT user_exists_by_email(?) as "exists"`, [email]);
            return result[0].exists;
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
}

// База данных
export const dbController = new DbController();
// Конектимся к базе..
dbController.connect();