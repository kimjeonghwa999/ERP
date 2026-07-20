const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. 미들웨어 설정 (정적 파일 제공 및 JSON 데이터 파싱)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const employeesPath = path.join(__dirname, 'employees.json');

// 2. 기본 라우터 (루트 접속 시 로그인 화면으로 이동)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 3. 로그인 API 라우터
app.post('/api/login', async (req, res) => {
    const { employeeId, password } = req.body;

    // 필수 입력값 체크
    if (!employeeId || !password) {
        return res.status(400).json({ success: false, message: '사원번호와 비밀번호를 모두 입력해주세요.' });
    }

    try {
        // employees.json 파일 읽기
        if (!fs.existsSync(employeesPath)) {
            return res.status(500).json({ success: false, message: '사원 데이터베이스 파일이 없습니다.' });
        }
        
        const fileData = fs.readFileSync(employeesPath, 'utf8');
        const employees = JSON.parse(fileData);

        // 객체 키(USER-01 등)로 사원 정보 찾기
        const employee = employees[employeeId];
        if (!employee) {
            return res.status(401).json({ success: false, message: '존재하지 않는 사원번호입니다.' });
        }

        // bcryptjs를 이용해 암호화된 비밀번호 대조
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
        }

        // 로그인 성공 응답
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

// 4. 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});