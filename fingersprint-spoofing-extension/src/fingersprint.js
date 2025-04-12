const { JSDOM } = require('jsdom');
const crypto = require('crypto');

// Hàm tạo số ngẫu nhiên trong khoảng
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Hàm giả lập fingerprint
const fakeFingerprint = () => {
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  const { window } = dom;
  const { navigator, screen } = window;

  // Giả lập `navigator.platform`
  Object.defineProperty(window.navigator, 'platform', {
    get: () => 'Linux x86_64',
  });

  // Giả lập kích thước màn hình
  const fakeScreen = {
    width: getRandomInt(360, 480),
    height: getRandomInt(640, 960),
    colorDepth: getRandomInt(24, 32),
    devicePixelRatio: parseFloat((Math.random() * (3 - 1) + 1).toFixed(2))
};

console.log('Fake Screen:', fakeScreen);

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

  console.log('[Fingerprint Spoofing Active]');
  return {
    uniqueID: crypto.randomUUID(),
    canvas: fakeCanvas(),
    webgl: fakeWebGL(),
    audio: fakeAudio(),
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
  };
};

// Xuất hàm fakeFingerprint
module.exports = { fakeFingerprint };