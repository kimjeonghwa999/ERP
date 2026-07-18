# 💼 사내 모바일 ERP 근태 관리 시스템 (ERP Attendance System)

> **Node.js(Express) 기반의 가벼우면서도 강력한 사원 출퇴근 및 연차 자동 정산 시스템입니다.**  
> 사원의 실제 위치 기반 출퇴근 검증 기능과 인사담당자 전용 관리자(HR) 보안 격리 페이지를 완벽하게 분리하여 구현했습니다.

<br>

## 🛠 Tech Stacks (기술 스택)

<img src="https://shields.io" alt="JavaScript" />&nbsp;
<img src="https://shields.io" alt="NodeJS" />&nbsp;
<img src="https://shields.io" alt="Express.js" />&nbsp;
<img src="https://shields.io" alt="HTML5" />&nbsp;
<img src="https://shields.io" alt="CSS3" />&nbsp;
<img src="https://shields.io" alt="Git" />

<br>

## ✨ Key Features (핵심 기능)

### 📱 1. 일반 사원용 모바일 최적화 근태 컴포넌트 (`/`)
* **반응형 웹 디자인 (Responsive UI)**: 스마트폰 가로 폭 및 터치 조작 환경에 맞춘 완전 반응형 UI 설계 (아이폰/안드로이드 완벽 대응).
* **위치 기반 실시간 출퇴근 검증 (Geolocation)**: 하베르사인(Haversine) 공식을 활용하여 회사 지정 위/경도 좌표와 사원의 실시간 GPS 위치 간의 물리적 거리를 연산, 관리자가 설정한 제한 반경 내에서만 출근이 가능하도록 물리 보안 적용.

### 💼 2. 인사팀 전용 관리자 컴포넌트 격리 (`/admin`)
* **디렉토리 기반 아키텍처 분리**: `public`(일반) 폴더와 `admin`(관리자) 폴더 구조를 백엔드 라우터 수준에서 완전 격리하여 불법적인 자원 접근 원천 차단.
* **실시간 가변 회사 설정**: 관리자 패널에서 회사의 주소, GPS 위/경도 좌표 및 출퇴근 제한 반경(m 단위)을 실시간으로 갱신 및 커스텀 반영 가능.
* **인사 발령 및 신규 사원 자동화 등록**: 사원 등록 시 회사 고유의 일련번호(Prefix+Sequence) 기반 사번 자동 발급 엔진 탑재.
* **실시간 근속 연차 자동 계산 시스템**: 사원별 입사일 데이터를 파싱하여 1년 미만/1년 이상 장기 근속 여부에 따른 잔여 연차 일수를 수학적 알고리즘으로 실시간 연산 후 명부 출력.

### 🔐 3. 데이터 보안 및 최적화
* **Bcryptjs 단방향 해시 암호화**: 사원 비밀번호 등록 및 인증 시 솔팅(Salting) 기법을 적용한 암호화 검증(`bcrypt.compareSync`) 알고리즘 탑재로 데이터 유출 원천 방지.
* **Lightweight JSON Database Architecture**: 초기 테스트 및 가벼운 로컬 가동을 위해 비동기 파일 시스템 기반 데이터 스토리지 구성.

<br>

## 📂 Project Directory Structure (폴더 구조)

```text
├── public/                # 일반 사원용 정적 자원 공간
│   ├── css/
│   │   └── main.css       # 모바일 반응형 근태 스타일 sheet
│   ├── js/
│   │   └── main.js        # Geolocation 연동 및 출퇴근 API 프론트 기능
│   └── index.html         # 메인 출퇴근 전용 웹 뷰
├── admin/                 # 관리자 전용 정적 자원 공간 (격리 구조)
│   ├── css/
│   │   └── admin.css      # 어드민 전용 레이아웃 스타일 sheet
│   ├── js/
│   │   └── admin.js       # 회사 설정 가변화 및 사원 등록/인사명부 비동기 통신 기능
│   └── index.html         # 회사 설정 및 인사 관리 대시보드 뷰
├── server.js              # Express 핵심 백엔드 구동 서버
├── employees.json         # 암호화된 사원 정보 데이터 저장소
├── company_config.json    # 가변 회사 설정 메타데이터 저장소
├── attendance.json        # 일자별 사원 출퇴근 로그 원장
└── package.json           # 의존성 및 패키지 기술 관리서