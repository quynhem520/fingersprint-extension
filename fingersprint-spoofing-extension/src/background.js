const { fakeFingerprint } = require('./fingersprint.js');

chrome.runtime.onInstalled.addListener(() => {
    console.log('Fingerprint Spoofing Extension installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateFingerprint') {
        try {
            const fingerprint = fakeFingerprint();
            sendResponse({ fingerprint });
        } catch (error) {
            console.error('Error generating fingerprint:', error);
            sendResponse({ error: 'Failed to generate fingerprint' });
        }
        return true; // Giữ kết nối mở để xử lý bất đồng bộ
    }
});