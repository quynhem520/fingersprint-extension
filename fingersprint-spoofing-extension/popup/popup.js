document.addEventListener('DOMContentLoaded', function () {
    const fingerprintOutput = document.getElementById('fingerprint-output');
    const generateButton = document.getElementById('generate-fingerprint');
    const spoofButton = document.getElementById('spoof-button');
    const resetButton = document.getElementById('reset-button');

    const userAgentElement = document.getElementById('user-agent');
    const timeZoneElement = document.getElementById('time-zone');

    // Hiển thị thông tin hệ thống
    if (userAgentElement && timeZoneElement) {
        userAgentElement.textContent = navigator.userAgent;
        timeZoneElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    if (!fingerprintOutput || !generateButton || !spoofButton || !resetButton) {
        console.error('Không tìm thấy các phần tử DOM cần thiết.');
        return;
    }

    // Xử lý nút Tạo Dấu Vân Tay
    generateButton.addEventListener('click', function () {
        fingerprintOutput.textContent = 'Đang tạo dấu vân tay...';
        chrome.runtime.sendMessage({ action: 'generateFingerprint' }, function (response) {
            if (chrome.runtime.lastError) {
                fingerprintOutput.textContent = 'Lỗi: ' + chrome.runtime.lastError.message;
            } else if (response && response.fingerprint) {
                fingerprintOutput.textContent = JSON.stringify(response.fingerprint, null, 2);
            } else {
                fingerprintOutput.textContent = 'Không thể tạo dấu vân tay.';
            }
        });
    });

    // Xử lý nút Giả Mạo Dấu Vân Tay
    spoofButton.addEventListener('click', function () {
        alert('Đã nhấn nút Giả Mạo Dấu Vân Tay! (Chức năng này đang được phát triển).');
    });

    // Xử lý nút Đặt Lại
    resetButton.addEventListener('click', function () {
        fingerprintOutput.textContent = 'Chưa tạo dấu vân tay nào.';
        console.log('Đã đặt lại dữ liệu dấu vân tay.');
    });
});