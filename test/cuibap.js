chrome.storage.local.get("userAgent", function(data) {
    const userAgent = data.userAgent || navigator.userAgent;

    const script = document.createElement('script');
    script.setAttribute('nonce', 'random12345');
    script.textContent = `
        Object.defineProperty(navigator, 'userAgent', {
            value: '${userAgent}',
            configurable: false,
            enumerable: true,
            writable: false
        });
    `;
    document.documentElement.appendChild(script);
    script.remove();
});