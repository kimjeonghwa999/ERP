const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function initDB() {
    // database.db 파일 생성 및 연결
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    // 회원(users) 테이블 생성
    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
    
    return db;
}

// 사용 예시 (회원가입 저장)
async function addUser(db, username, hashedPassword) {
    await db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
}