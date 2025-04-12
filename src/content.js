// Hook vào API canvas để thay đổi fingerprint
const hookCanvas = () => {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      const ctx = this.getContext('2d');
      if (ctx) {
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.fillRect(0, 0, 10, 10); // Thêm dữ liệu giả lập
      }
      return originalToDataURL.apply(this, args);
    };
  
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function (...args) {
      const data = originalGetImageData.apply(this, args);
      for (let i = 0; i < data.data.length; i += 4) {
        data.data[i] = data.data[i] ^ 123; // Thay đổi giá trị pixel
      }
      return data;
    };
  };
  
  // Hook WebGL Fingerprint
  const hookWebGL = () => {
    const getParameter = WebGLRenderingContext.prototype.getParameter;
  
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      // Chỉ giả lập các tham số hợp lệ
      if (parameter === this.RENDERER) {
        return "Fake GPU Renderer";
      }
      if (parameter === this.VENDOR) {
        return "Fake GPU Vendor";
      }
      // Gọi lại phương thức gốc nếu tham số không được giả lập
      return getParameter.apply(this, arguments);
    };
  };
  
  // Fake User-Agent
  const fakeUserAgent = (userAgent) => {
    if (userAgent) {
      const userAgentProxy = new Proxy(navigator, {
        get: (target, property) => {
          if (property === "userAgent") {
            return userAgent;
          }
          return target[property];
        },
      });
  
      Object.defineProperty(window, "navigator", {
        value: userAgentProxy,
        configurable: true,
      });
    }
  };
  
  // Fake Time Zone
  const fakeTimeZone = (timezone) => {
    if (timezone) {
      const original = Intl.DateTimeFormat.prototype.resolvedOptions;
      Intl.DateTimeFormat.prototype.resolvedOptions = function () {
        const options = original.apply(this, arguments);
        options.timeZone = timezone;
        return options;
      };
    }
  };
  
  // Hàm chính để áp dụng giả lập fingerprint
  const applyFingerprintSpoofing = () => {
    chrome.storage.local.get(["enabled", "timezone", "userAgent"], (data) => {
      if (!data.enabled) {
        console.log("[Fingerprint Spoofing Disabled]");
        return;
      }
  
      // Áp dụng các phương pháp giả lập
      hookCanvas();
      hookWebGL();
      fakeTimeZone(data.timezone);
      fakeUserAgent(data.userAgent);
  
      console.log("[Fingerprint Spoofing Active]");
    });
  };
  
  // Chạy hàm chính
  applyFingerprintSpoofing();