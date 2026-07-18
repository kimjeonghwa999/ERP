function getCoordinates() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) return resolve({ lat: null, lon: null });
        navigator.geolocation.getCurrentPosition((p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }), () => resolve({ lat: null, lon: null }));
    });
}
async function checkIn() {
    const employeeId = document.getElementById('empId').value.trim();
    const password = document.getElementById('empPwd').value.trim();
    if(!employeeId || !password) return alert('정보를 입력해주세요.');
    const { lat, lon } = await getCoordinates();
    const res = await fetch('/api/attendance/check-in', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, password, lat, lon }) });
    const result = await res.json();
    const logDiv = document.getElementById('log'); logDiv.style.display = 'block';
    if(res.status !== 200) { logDiv.style.backgroundColor = '#ffebee'; logDiv.style.color = '#c62828'; logDiv.innerText = result.message; }
    else { logDiv.style.backgroundColor = '#e8f5e9'; logDiv.style.color = '#2e7d32'; logDiv.innerText = `${result.data.name}님, 출근 완료!`; }
}
async function checkOut() {
    const employeeId = document.getElementById('empId').value.trim();
    const password = document.getElementById('empPwd').value.trim();
    if(!employeeId || !password) return alert('정보를 입력해주세요.');
    const res = await fetch('/api/attendance/check-out', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeId, password }) });
    const result = await res.json();
    const logDiv = document.getElementById('log'); logDiv.style.display = 'block';
    if(res.status !== 200) { logDiv.style.backgroundColor = '#ffebee'; logDiv.style.color = '#c62828'; logDiv.innerText = result.message; }
    else { logDiv.style.backgroundColor = '#e8f5e9'; logDiv.style.color = '#2e7d32'; logDiv.innerText = `${result.data.name}님, 퇴근 완료!`; }
}