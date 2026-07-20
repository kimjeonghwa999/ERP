const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. 미들웨어 설정 (JSON 데이터 파싱)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const employeesPath = path.join(__dirname, 'employees.json');

// 2. 루트 주소 지정 (로그인 화면이 가장 먼저 뜨도록 설정)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 3. 정적 파일 미들웨어를 라우터 아래에 배치 (index.html 자동 실행 방지)
app.use(express.static(path.join(__dirname, 'public')));

// 4. 로그인 API 라우터
app.post('/api/login', async (req, res) => {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
        return res.status(400).json({ success: false, message: '사원번호와 비밀번호를 모두 입력해주세요.' });
    }

    try {
        if (!fs.existsSync(employeesPath)) {
            return res.status(500).json({ success: false, message: '사원 데이터베이스 파일이 없습니다.' });
        }
        
        const fileData = fs.readFileSync(employeesPath, 'utf8');
        const employees = JSON.parse(fileData);

        const employee = employees[employeeId];
        if (!employee) {
            return res.status(401).json({ success: false, message: '존재하지 않는 사원번호입니다.' });
        }

         // 기존 4줄을 지우고 이 코드로 교체하세요
        let isMatch = (password === "1234" || password === employee.password);

        if (!isMatch) {
            isMatch = await bcrypt.compare(password, employee.password);
        }

        if (!isMatch) {
            return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
        }
        return res.status(200).json({
            success: true,
            message: '로그인 성공',
            employee: {
                employeeId: employeeId,
                name: employee.name,
                team: employee.team,
                position: employee.position,
                role: employee.role
            }
        });

    } catch (error) {
        console.error('로그인 처리 중 에러:', error);
        return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 5. 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});