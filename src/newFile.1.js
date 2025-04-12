const { spoofScreenProperties, spoofNavigatorProperties, spoofTimezone, fakeCanvas, fakeWebGL, fakeAudio, fakeFonts } = require("./content");

// Apply all spoofing
(() => {
    spoofScreenProperties();
    spoofNavigatorProperties();
    spoofTimezone();
    const hookCanvas = () => {
        const toDataURL = HTMLCanvasElement.prototype.toDataURL;
        HTMLCanvasElement.prototype.toDataURL = function (...args) {
            const ctx = this.getContext('2d');
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(0, 0, 10, 10); // Thêm dữ liệu giả lập
            return toDataURL.apply(this, args);
        };

        const getImageData = CanvasRenderingContext2D.prototype.getImageData;
        CanvasRenderingContext2D.prototype.getImageData = function (...args) {
            const data = getImageData.apply(this, args);
            for (let i = 0; i < data.data.length; i += 4) {
                data.data[i] = data.data[i] ^ 123; // Thay đổi dữ liệu pixel
            }
            return data;
        };
    };

    (() => {
        hookCanvas();
        console.log('[Fingerprint Spoofing Active]');
        console.log(`Canvas Fingerprint: ${fakeCanvas()}`);
        console.log(`WebGL Renderer: ${fakeWebGL()}`);
        console.log(`Audio Fingerprint: ${fakeAudio()}`);
        console.log(`Installed Fonts: ${fakeFonts()}`);
    })();
});
