const { JSDOM } = require('jsdom');
const crypto = require('crypto');
const config = require('./config');

const uniqueID = crypto.randomUUID(); // Tạo ID duy nhất
console.log(`Unique ID for this fingerprint: ${uniqueID}`);
console.log(`User-Agent: ${config.userAgent}`);
console.log(`Time Zone: ${config.timeZone}`);

// Hàm tạo số ngẫu nhiên trong khoảng
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const fakeFingerprint = () => {
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  const { window } = dom;
  const { navigator, screen } = window;

  // Giả lập `navigator.platform`
  Object.defineProperty(window.navigator, 'platform', {
    get: () => 'Linux x86_64',
  });

  // Giả lập kích thước màn hình
  Object.defineProperty(window.screen, 'width', {
    get: () => getRandomInt(360, 480),
  });

  Object.defineProperty(window.screen, 'height', {
    get: () => getRandomInt(640, 960),
  });

  // Fake Canvas Fingerprinting
  const fakeCanvas = () => {
    const canvas = window.document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = `${getRandomInt(10, 20)}px Arial`; // Kích thước font ngẫu nhiên
    ctx.fillStyle = `rgb(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)})`; // Màu ngẫu nhiên
    ctx.fillRect(getRandomInt(0, 150), getRandomInt(0, 50), getRandomInt(50, 100), getRandomInt(20, 50)); // Hình chữ nhật ngẫu nhiên
    ctx.fillStyle = `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${Math.random().toFixed(2)})`; // Màu ngẫu nhiên với độ trong suốt
    ctx.fillText(`RandomText${getRandomInt(1000, 9999)}`, getRandomInt(0, 50), getRandomInt(10, 50)); // Văn bản ngẫu nhiên
    return canvas.toDataURL();
  };

  // Fake WebGL Fingerprinting
  const fakeWebGL = () => {
    const canvas = window.document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'WebGL not supported';
    const fakeRenderers = [
      'Intel Iris Plus Graphics',
      'NVIDIA GeForce GTX 1050',
      'AMD Radeon RX 580',
      'Fake GPU Renderer',
    ];
    return fakeRenderers[getRandomInt(0, fakeRenderers.length - 1)];
  };

  // Fake Audio Fingerprinting
  const fakeAudio = () => {
    const audioCtx = new window.AudioContext();
    const oscillator = audioCtx.createOscillator();
    const waveTypes = ['sine', 'square', 'sawtooth', 'triangle'];
    oscillator.type = waveTypes[getRandomInt(0, waveTypes.length - 1)]; // Loại sóng âm ngẫu nhiên
    oscillator.frequency.setValueAtTime(getRandomInt(200, 1000), audioCtx.currentTime); // Tần số ngẫu nhiên
    const analyser = audioCtx.createAnalyser();
    oscillator.connect(analyser);
    analyser.connect(audioCtx.destination);
    oscillator.start(0);
    const array = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(array);
    oscillator.stop();
    return array[getRandomInt(0, array.length - 1)].toFixed(2); // Trả về giá trị ngẫu nhiên từ mảng tần số
  };

  // Fake Installed Fonts
  const fakeFonts = () => {
    const fonts = [
      'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
      'Comic Sans MS', 'Impact', 'Trebuchet MS', 'FakeFont1', 'FakeFont2',
    ];
    const selectedFonts = [];
    const fontCount = getRandomInt(1, 3); // Chọn 1-3 font ngẫu nhiên
    for (let i = 0; i < fontCount; i++) {
      selectedFonts.push(fonts[getRandomInt(0, fonts.length - 1)]);
    }
    return selectedFonts.join(', ');
  };

  // Fake Screen size
  Object.defineProperty(screen, 'width', {
    get: () => getRandomInt(360, 480), // Chiều rộng từ 360px đến 480px
  });
  Object.defineProperty(screen, 'height', {
    get: () => getRandomInt(640, 960), // Chiều cao từ 640px đến 960px
  });
  Object.defineProperty(screen, 'colorDepth', {
    get: () => getRandomInt(24, 32), // Độ sâu màu từ 24 đến 32 bit
  });
  Object.defineProperty(window, 'devicePixelRatio', {
    get: () => parseFloat((Math.random() * (3 - 1) + 1).toFixed(2)), // Tỷ lệ màn hình từ 1.00 đến 3.00
  });

  console.log('[Fingerprint Spoofing Active]');
  console.log(`Unique ID: ${crypto.randomUUID()}`);
  console.log(`Canvas Fingerprint: ${fakeCanvas()}`);
  console.log(`WebGL Renderer: ${fakeWebGL()}`);
  console.log(`Audio Fingerprint: ${fakeAudio()}`);
  console.log(`Installed Fonts: ${fakeFonts()}`);
  console.log(`Screen: ${screen.width}x${screen.height}, Color Depth: ${screen.colorDepth}, Pixel Ratio: ${window.devicePixelRatio}`);
};

(() => {
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Giả lập các thông số fingerprint
  Object.defineProperty(navigator, 'platform', {
    get: () => 'Linux x86_64',
  });

  Object.defineProperty(screen, 'width', {
    get: () => getRandomInt(360, 480),
  });

  Object.defineProperty(screen, 'height', {
    get: () => getRandomInt(640, 960),
  });

  console.log('[Fingerprint Spoofing Active]');
})();

module.exports = { fakeFingerprint };