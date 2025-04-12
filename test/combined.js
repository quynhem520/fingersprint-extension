document.addEventListener("DOMContentLoaded", function () {
    let userAgentInput = document.getElementById("userAgentInput");
    let saveBtn = document.getElementById("saveBtn");
    let toggleBtn = document.getElementById("toggleBtn");
    let savedUAsList = document.getElementById("savedUAs");
    let clearBtn = document.getElementById("clearUAs");
    let resetBtn = document.getElementById("resetBtn");
    let searchInput = document.getElementById("searchInput");
    let randomBtn = document.getElementById("randomBtn");
    let currentUAStatus = document.getElementById("currentUAStatus");
    let tabButtons = document.querySelectorAll(".tab-button");
    let tabContents = document.querySelectorAll(".tab-content");

    function activateTab(tab) {
        tabContents.forEach(content => {
            content.classList.remove("active");
        });
        tabButtons.forEach(button => {
            button.classList.remove("active");
        });
        document.getElementById(tab).classList.add("active");
        document.querySelector(`[data-tab="${tab}"]`).classList.add("active");
    }

    tabButtons.forEach(button => {
        button.addEventListener("click", function () {
            activateTab(button.getAttribute("data-tab"));
        });
    });

    // Lưu User-Agent vào danh sách
    document.addEventListener('DOMContentLoaded', function() {
        const saveBtn = document.getElementById('saveBtn');
        const userAgentInput = document.getElementById('userAgentInput');
        
        if (saveBtn && userAgentInput) {
            saveBtn.addEventListener("click", function() {
                let newUA = userAgentInput.value.trim();
                if (newUA) {
                    chrome.storage.local.get("savedUAs", function(data) {
                        let updatedList = data.savedUAs || [];
                        updatedList.push(newUA);
                        chrome.storage.local.set({ savedUAs: updatedList }, function() {
                            console.log("User-Agent saved");
    
                            // Cập nhật User-Agent hiện tại
                            chrome.storage.local.set({ userAgent: newUA }, function () {
                                chrome.runtime.sendMessage({ action: "updateUA", userAgent: newUA });
                                updateCurrentUAStatus();
                            });
                        });
                    });
                }
            });
        } else {
            console.error("saveBtn or userAgentInput not found");
        }
    });
    
    function updateCurrentUAStatus() {
        chrome.storage.local.get("userAgent", function(data) {
            const currentUA = data.userAgent || navigator.userAgent;
            console.log("Current User-Agent:", currentUA);
            // Cập nhật trạng thái User-Agent hiện tại trên giao diện người dùng
            const currentUAStatus = document.getElementById('currentUAStatus');
            if (currentUAStatus) {
                currentUAStatus.textContent = `Current User-Agent: ${currentUA}`;
            }
        });
    }

    // Hiển thị danh sách UA đã lưu
    function renderSavedUAs() {
        savedUAsList.innerHTML = "";
        chrome.storage.local.get("savedUAs", function (data) {
            (data.savedUAs || []).forEach((ua, index) => {
                let li = document.createElement("li");
                li.textContent = ua;
                li.addEventListener("click", function () {
                    userAgentInput.value = ua;  // Chọn UA từ danh sách
                });

                // Nút xóa từng User-Agent
                let deleteBtn = document.createElement("button");
                deleteBtn.textContent = "X";
                deleteBtn.className = "delete-btn";
                deleteBtn.addEventListener("click", function (event) {
                    event.stopPropagation();
                    removeUserAgent(index);
                });

                li.appendChild(deleteBtn);
                savedUAsList.appendChild(li);
            });
        });
    }

    // Xóa User-Agent theo chỉ mục
    function removeUserAgent(index) {
        chrome.storage.local.get("savedUAs", function (data) {
            let updatedList = data.savedUAs || [];
            updatedList.splice(index, 1);
            chrome.storage.local.set({ savedUAs: updatedList }, function () {
                renderSavedUAs();
            });
        });
    }

    // Xóa tất cả UA đã lưu
    clearBtn.addEventListener("click", function () {
        chrome.storage.local.set({ savedUAs: [] }, function () {
            renderSavedUAs();
        });
    });

    // Đặt lại User-Agent
    resetBtn.addEventListener("click", function () {
        chrome.storage.local.set({ userAgent: "" }, function () {
            userAgentInput.value = "";
            alert("User-Agent đã được đặt lại!");
            chrome.runtime.sendMessage({ action: "updateUA", userAgent: "" });
            updateCurrentUAStatus();
        });
    });

    // Đổi User-Agent ngẫu nhiên
    randomBtn.addEventListener("click", function () {
        chrome.storage.local.get("savedUAs", function (data) {
            let savedUAs = data.savedUAs || [];
            if (savedUAs.length > 0) {
                // Chọn ngẫu nhiên một User-Agent từ danh sách
                let randomUA = savedUAs[Math.floor(Math.random() * savedUAs.length)];
                userAgentInput.value = randomUA;
    
                // Cập nhật User-Agent hiện tại
                chrome.storage.local.set({ userAgent: randomUA }, function () {
                    chrome.runtime.sendMessage({ action: "updateUA", userAgent: randomUA });
                    alert(`User-Agent đã được đổi thành: ${randomUA}`);
                });
            } else {
                alert("Danh sách User-Agent trống. Vui lòng thêm User-Agent trước!");
            }
        });
    });

    // Tìm kiếm User-Agent trong danh sách
    searchInput.addEventListener("input", function () {
        let searchTerm = searchInput.value.toLowerCase();
        let listItems = savedUAsList.getElementsByTagName("li");

        Array.from(listItems).forEach(item => {
            let uaText = item.textContent.toLowerCase();
            if (uaText.includes(searchTerm)) {
                item.style.display = ""; // Hiển thị nếu khớp
            } else {
                item.style.display = "none"; // Ẩn nếu không khớp
            }
        });
    });

    // Lấy User-Agent đã lưu và trạng thái bật/tắt
    chrome.storage.local.get(["userAgent", "enabled"], function (data) {
        if (data.userAgent) userAgentInput.value = data.userAgent;
        toggleBtn.textContent = data.enabled ? "Tắt User-Agent" : "Bật User-Agent";
        updateCurrentUAStatus();
    });

    // Bật/tắt User-Agent
    toggleBtn.addEventListener("click", function () {
        chrome.storage.local.get("enabled", function (data) {
            let newState = !data.enabled;
            chrome.storage.local.set({ enabled: newState }, function () {
                toggleBtn.textContent = newState ? "Tắt User-Agent" : "Bật User-Agent";
                chrome.runtime.sendMessage({ action: "toggleUA", enabled: newState });
            });
        });
    });

    // Cập nhật trạng thái User-Agent hiện tại
    function updateCurrentUAStatus() {
        chrome.storage.local.get("userAgent", function (data) {
            currentUAStatus.textContent = data.userAgent
                ? `User-Agent hiện tại: ${data.userAgent}`
                : "User-Agent hiện tại: Chưa được đặt";
        });
    }

    // Gọi khi popup mở
    renderSavedUAs();
    activateTab("tab1"); // Mặc định mở tab 1

    // Các tính năng mới
    document.getElementById('generateBtn').addEventListener('click', generateUserAgents);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('saveBtn').addEventListener('click', saveToFile);
    document.getElementById('createAccountBtn').addEventListener('click', generateAccount);
});

    const devices = [
       // Danh sách thiết bị
       "RMX2001", "XT2141-1", "BV5200", "FP4", "BV8800", "G9F4F", "ROG-Phone-3", "Pixel-Tablet", "TCL-30XL", "Pixel-Fold", "M2104K10AC", "CPH2195", "RedMagic-7", "XT2153-1", "Pixel-3", 
       "CPH2401", "CPH2599", "CPH2485", "SM-G570Y", "STK-LX3", "CPH2587", "V2307A", "XQ-BQ52", "M2105K81C", "V2118", "Armor15", "M2004J19G", "XQ-DQ72", "A065", "Librem-5", "CPH2521", 
       "CPH2375", "S95Pro", "RMX3572", "RMX2189", "V2020A", "SM-N960F", "RedMagic-8", "RMX3571", "CPH2481", "BV9800", "SM-S918B", "T810S", "XT2223-3", "ROG-Phone-5", "XQ-CQ72", "XQ-AT52", 
       "SM-G965F", "Pixel-4", "iQOO-Z10", "POCO-C71", "Vivo-V50e", "TCL-50SE", "S88Plus", "X6820", "ROG-Phone-7", "XT1068", "M2101K9C", "BNE-LX1", "RMX3491", "MNA-AL00", "OnePlus-3T", 
       "IN2023", "S62Pro", "CPH2411", "M2010J19SG", "BKL-L09", "M2391", "XQ-DQ54", "V2025", "SM-A135M", "XQ-CT54", "XT2205-1", "ROG-Phone-6", "SM-X710", "AI2205", "SM-M236B", "OnePlus-12R", "OnePlus-11", "OnePlus-11R", "OnePlus-10T", "OnePlus-10-Pro", "Pixel-6-Pro", "XT2321-5", 
       "BV7100", "XT2389-8", "Pixel-8", "V2145", "GHL1X", "XT2367-7", "OCE-AN10", "XT1092", "CPH2509", "XT2201-6", "XT2301-4", "SM-J730G", "V2313A", "M2102K1G", "RMX3363", "XT2263-4", "XT2345-6", 
       "PJD110", "SM-A546E", "Unihertz-Titan", "M2006C3MNG", "RMX3772", "CPH2193", "Vega-X", "STK-L22", "XT2311-1", "V1955A", "M2007J1SC", "V2156A", "LePro3", "V2166A", "IN2021"
        ];       
         
    const buildNumbers = [
       "RQ1A.250127.002", "RQ1A.250203.002", "RQ1A.250206.001", "RQ1A.250304.006",
       "RQ1A.250308.007", "RQ1A.250318.003", "RQ1A.250324.004", "RQ1A.250402.007",
       "RQ1A.250417.002", "SP1A.250101.008", "SP1A.250107.005", "SP1A.250203.009",
       "SP1A.250221.008", "SP1A.250301.001", "SP1A.250302.009", "SP1A.250308.008",
       "SP1A.250409.005", "SP1A.250417.001", "SP1A.250419.007", "SP1A.250428.007",
       "TP1A.250110.004", "TP1A.250128.005", "TP1A.250203.008", "TP1A.250208.005",
       "TP1A.250212.008", "TP1A.250221.007", "TP1A.250319.008", "TP1A.250430.006",
       "TQ1A.250108.009", "TQ1A.250113.003", "TQ1A.250117.007", "TQ1A.250123.009",
       "TQ1A.250205.001", "TQ1A.250221.004", "TQ1A.250324.007", "TQ1A.250411.005",
       "UP1A.250104.002", "UP1A.250118.008", "UP1A.250126.004", "UP1A.250217.005",
       "UP1A.250301.006", "UP1A.250309.002", "UP1A.250414.008", "UP1A.250416.009",
       "UP1A.250429.009", "VP1A.250104.007", "VP1A.250104.009", "VP1A.250203.004",
       "VP1A.250315.001", "VP1A.250318.005", "VP1A.250405.006", "VP1A.250420.001",
       "VP2A.250107.002", "VP2A.250110.003", "VP2A.250317.009", "VP2A.250321.003",
       "VP2A.250328.002", "VP2A.250331.005", "VP2A.250411.002", "VP3A.250113.002",
       "VP3A.250118.009", "VP3A.250206.005", "VP3A.250209.004", "VP3A.250210.006",
       "VP3A.250218.004", "VP3A.250401.009", "VP3A.250428.007", "VP3A.250428.008",
       "VP4A.250206.002", "VP4A.250206.006", "VP4A.250208.006", "VP4A.250214.003",
       "VP4A.250228.002", "VP4A.250308.009", "VP4A.250326.001", "VP4A.250419.005"
        ];

    const architectures = ["arm64-v8a", "armeabi-v7a", "x86", "x86_64"];

function generateUserAgents() {
    const count = parseInt(document.getElementById('userAgentCount').value, 10);
    const os = document.getElementById('osSelection').value;
    const browser = document.getElementById('browserType').value;
    const chromeVersion = document.getElementById('chromeVersion').value;
    const includeBuild = document.getElementById('includeBuild').checked;
    const includeArchitecture = document.getElementById('includeHardware').checked;

    if (isNaN(count) || count <= 0) {
        showStatus('Vui lòng nhập số lượng hợp lệ.', 'error');
        return;
    }

    if (count > devices.length || count > buildNumbers.length) {
        showStatus('Số lượng vượt quá dữ liệu có sẵn.', 'error');
        return;
    }

    // Trộn dữ liệu ngẫu nhiên
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
    shuffleArray(devices);
    shuffleArray(buildNumbers);

    const results = [];
    const stats = { Chrome: 0, Opera: 0, Firefox: 0, Safari: 0 };

    for (let i = 0; i < count; i++) {
        const version = `${chromeVersion || Math.floor(Math.random() * 30) + 100}.0.${Math.floor(Math.random() * 1000) + 6000}.${Math.floor(Math.random() * 300)}`;
        const device = devices[Math.floor(Math.random() * devices.length)];
        const androidVersion = `Android ${Math.floor(Math.random() * 5) + 10}`;
            `X11; Linux x86_64`;
        const architecture = includeArchitecture ? `; ${architectures[Math.floor(Math.random() * architectures.length)]}` : '';
        const build = includeBuild ? ` Build/${buildNumbers[Math.floor(Math.random() * buildNumbers.length)]}` : '';

        let osInfo;
        switch (os) {
            case "Android":
                osInfo = `Linux; Android ${Math.floor(Math.random() * 5) + 10}; ${device}`;
                break;
            case "Windows":
                osInfo = `Windows NT ${Math.random() < 0.5 ? "10.0" : "11.0"}; Win64; x64`;
                break;
            case "macOS":
                osInfo = `Macintosh; Intel Mac OS X 10_${Math.floor(Math.random() * 5) + 12}_1`;
                break;
            default:
                osInfo = `X11; Linux x86_64`;
        }

        let userAgent = `Mozilla/5.0 (${osInfo}${build}${architecture}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version}`;

        const operaVersion = `${Math.floor(Math.random() * 39) + 80}.0.${Math.floor(Math.random() * 5000) + 100}.100`;

        switch (browser) {
            case "Chrome":
                userAgent += ` Mobile Safari/537.36`;
                stats.Chrome++;
                break;
            case "Opera":
                userAgent += ` OPR/${operaVersion} Mobile Safari/537.36`;
                stats.Opera++;
                break;
            case "Firefox":
                userAgent = `Mozilla/5.0 (${osInfo}) Gecko/20100101 Firefox/${Math.floor(Math.random() * 15) + 110}.0`;
                stats.Firefox++;
                break;
            case "Safari":
                userAgent += ` Version/4.0 Safari/${Math.floor(Math.random() * 100) + 600}.1.4`;
                stats.Safari++;
                break;
        }

        results.push(userAgent);
    }

    // Hiển thị kết quả
    document.getElementById('resultBox').value = results.join('\n');
    showStatus(`Đã tạo thành công ${count} User-Agent!\n 
        - Chrome: ${stats.Chrome} 
        - Opera: ${stats.Opera} 
        - Firefox: ${stats.Firefox} 
        - Safari: ${stats.Safari}`, 'success');
}

// Sao chép dữ liệu
function copyToClipboard() {
    const text = document.getElementById('resultBox').value.trim();
    if (!text) {
        showStatus('Không có dữ liệu để sao chép!', 'error');
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => showStatus('Đã sao chép vào clipboard!', 'success'))
        .catch(() => showStatus('Sao chép thất bại!', 'error'));
}

// Lưu file TXT
function saveToFile() {
    const text = document.getElementById('resultBox').value.trim();
    if (!text) {
        showStatus('Không có dữ liệu để lưu!', 'error');
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_agents.txt';
    link.click();

    showStatus('Đã lưu thành công!', 'success');
}

// Tạo tài khoản ngẫu nhiên
function generateAccount() {
    const prefixes = ['zoo', 'zinc', 'word', 'wire', 'wall', 'verse', 'vase', 'tree', 'toy', 'trail', 'tank', 'spot', 'skin', 'salt', 'rose', 'match', 'meal', 'neck', 'need', 'nut', 'oil', 'lamp', 'hair', 'hall', 'join', 'foot', 'fork', 'fold', 'fact', 'dock', 'class', 'bed', 'bone', 'arm', 'cat', 'cart', 'comb', 'bed', 'hall', 'rat', 'rate', 'leg', 'men', 'fear', 'boy', 'bone', 'door', 'game', 'leg', 'pot', 'oven', 'rat', 'kite', 'dad', 'mint', 'name', 'nest', 'noise', 'note', 'nut', 'stop', 'top', 'trip', 'ball', 'ant', 'rail', 'pail', 'roll', 'lip', 'loss', 'cup', 'cry', 'song', 'cap', 'low', 'monkey', 'ray', 'tin', 'joke', 'ice', 'art', 'bee', 'use', 'zoo', 'war', 'tree', 'star', 'wood', 'sea', 'robin', 'cows', 'toy', 'wax', 'tiger', 'side', 'wind', 'cats', 'coil', 'box'];
    const nhitam = ['22a', '999', '33p', '77b', '222', '55b', '99b', '11a', '777', '44x', '111', '88x', '000', '333', '555', '66x', '888', '444', '00a', '666'];
    const years = [
        '112', '130', '106', '172', '96', '308', '127', '130', '316', '98', '35', '25', '98', '135', '70', '130', '40', '239', '206', '40', '239', '91', '265', '93',
        '136', '357', '306', '139', '30', '82', '68', '92', '81', '99', '96', '121', '260', '46', '257', '95', '243', '248', '63', '90', '248', '365', '112',
        '174', '81', '175', '288', '306', '63', '36', '188', '194', '59', '194', '130', '40', '58', '22', '135', '15', '305', '328', '31', '94', '95', '27', '368',
        '94', '39', '174', '301', '294', '29', '71', '90', '240', '72', '63', '98', '194', '293', '259', '47', '139', '57', '106', '34', '376', '350', '130', '76'
    ];

    const randomNumber = Math.floor(Math.random() * 1000); // Tạo số ngẫu nhiên từ 0 đến 999
    const username = prefixes[Math.floor(Math.random() * prefixes.length)] + randomNumber; // Tạo tên tài khoản ngẫu nhiên

    const characters = 'qtyuiopdghklzxcvbnm0123456789';
    const passwordLength = Math.floor(Math.random() * 2) + 8; // Độ dài mật khẩu từ 8 đến 9 ký tự
    let passwordRandom = '';

    // Tạo mật khẩu ngẫu nhiên
    for (let i = 0; i < passwordLength; i++) {
        passwordRandom += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Tạo mật khẩu với các thành phần: tên tài khoản, năm ngẫu nhiên và mật khẩu ngẫu nhiên
    const password = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${nhitam[Math.floor(Math.random() * nhitam.length)]}${passwordRandom}${randomNumber}`;

    // Thêm dấu "_" hoặc "." ngẫu nhiên và một từ ngẫu nhiên vào email
    const separator = Math.random() < 0.5 ? '_' : '.';
    const emailPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const email = `${username}${separator}${emailPrefix}${Math.floor(Math.random() * 100)}@gmail.com`;

    // Kiểm tra và hiển thị kết quả
    if (username && password && email) {
        document.getElementById('accountResultBox').value = `${username}|${password}|${email}`;
        alert('Đã tạo tài khoản thành công!');
    } else {
        alert('Có lỗi xảy ra trong quá trình tạo tài khoản.');
    }
}
// Hiển thị trạng thái với hiệu ứng mờ dần
function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = type === 'success' ? 'status-success' : 'status-error';

    setTimeout(() => {
        statusMessage.classList.add('fade-out');
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 500); // Đợi hiệu ứng hoàn tất trước khi ẩn
    }, 3000);
}

