const fakeCanvas = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '16px Arial';
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillText('Hello World', 10, 10);
  return canvas.toDataURL();
};

const fakeWebGL = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
      console.warn('WebGL not supported');
      return 'WebGL not supported';
  }
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown Renderer';
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request || !request.action) {
      console.error('Invalid request:', request);
      sendResponse({ error: 'Invalid request' });
      return false;
  }

  if (request.action === 'generateCanvas') {
    console.log('Generating canvas fingerprint...');
    // Thay thế bằng logic thực tế tạo fingerprint canvas
    const canvasData = 'Fake Canvas Data';
    sendResponse({ canvas: canvasData });
} else if (request.action === 'generateWebGL') {
    console.log('Generating WebGL fingerprint...');
    // Thay thế bằng logic thực tế tạo fingerprint WebGL
    const webglData = 'Fake WebGL Data';
    sendResponse({ webgl: webglData });
} else {
    console.warn('Unknown action:', request.action);
    sendResponse({ error: 'Unknown action' });
}

return true; // Đảm bảo sendResponse hoạt động với async
});