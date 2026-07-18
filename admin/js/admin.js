async function loadCurrentConfig() {
    const requesterId = document.getElementById('reqId').value;
    const password = document.getElementById('reqPwd').value;
    try {
        const res = await fetch('/api/hr/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requesterId, password })
        });
        if (res.ok) {
            const config = await res.json();
            document.getElementById('companyAddress').value = config.companyAddress || '';
            document.getElementById('latitude').value = config.latitude || '';
            document.getElementById('longitude').value = config.longitude || '';
            document.getElementById('limitDistance').value = config.limitDistance || '';
        }
    } catch (error) { console.error(error); }
}

async function updateCompanyConfig() {
    const requesterId = document.getElementById('reqId').value;
    const password = document.getElementById('reqPwd').value;
    const companyAddress = document.getElementById('companyAddress').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    const limitDistance = document.getElementById('limitDistance').value;

    try {
        const res = await fetch('/api/hr/config/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requesterId, password, companyAddress, latitude, longitude, limitDistance })
        });
        if (res.ok) alert("회사 설정이 저장되었습니다!");
    } catch (error) { alert("통신 실패"); }
}

// [신규 기능] 사원 등록 전송함수
async function registerEmployee() {
    const requesterId = document.getElementById('reqId').value;
    const password = document.getElementById('reqPwd').value;
    
    const name = document.getElementById('newEmpName').value.trim();
    const newEmpPassword = document.getElementById('newEmpPwd').value.trim();
    const team = document.getElementById('newEmpTeam').value.trim();
    const position = document.getElementById('newEmpPosition').value.trim();
    const joinDate = document.getElementById('newEmpJoinDate').value;

    if(!name || !newEmpPassword || !team || !position) return alert("사원 정보를 빠짐없이 입력하세요.");

    try {
        const res = await fetch('/api/hr/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requesterId, password, name, newEmpPassword, team, position, joinDate })
        });
        const result = await res.json();
        if(res.ok) {
            alert(`등록 성공! 자동 발급된 사번: ${result.generatedId}`);
            loadEmployeeList(); // 사원목록 갱신
        } else { alert(result.message); }
    } catch (error) { alert("서버 통신 오류"); }
}

// [신규 기능] 전사원 명부 출력함수
async function loadEmployeeList() {
    const requesterId = document.getElementById('reqId').value;
    const password = document.getElementById('reqPwd').value;
    const listArea = document.getElementById('employeeListArea');

    try {
        const res = await fetch('/api/hr/employees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requesterId, password })
        });
        const result = await res.json();
        if(res.ok) {
            if(result.employees.length === 0) { listArea.innerHTML = "등록된 사원이 없습니다."; return; }
            let html = "";
            result.employees.forEach(emp => {
                html += `<div><strong>[사번: ${emp.id}]</strong> ${emp.name} (${emp.team} / ${emp.position}) - 입사일: ${emp.joinDate}<br>&nbsp;&nbsp;└ 총 연차: ${emp.vacation.total}일 / 사용: ${emp.vacation.used}일 / 잔여: ${emp.vacation.left}일</div><hr style='border:0; border-top:1px dashed #cbd5e1; margin:8px 0;'>`;
            });
            listArea.innerHTML = html;
        } else { listArea.innerText = result.message; }
    } catch (error) { listArea.innerText = "데이터 로드 실패"; }
}

window.onload = function() {
    loadCurrentConfig();
    loadEmployeeList();
};