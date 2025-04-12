document.addEventListener('DOMContentLoaded', () => {
    const toggleFingerprint = document.getElementById('toggle-fingerprint');
    const timezoneInput = document.getElementById('timezone');
    const userAgentInput = document.getElementById('user-agent');
    const saveButton = document.getElementById('save-settings');
  
    // Load saved settings
    chrome.storage.local.get(['enabled', 'timezone', 'userAgent'], (data) => {
      toggleFingerprint.checked = data.enabled || false;
      timezoneInput.value = data.timezone || '';
      userAgentInput.value = data.userAgent || '';
    });
  
    // Save settings
    saveButton.addEventListener('click', () => {
      const enabled = toggleFingerprint.checked;
      const timezone = timezoneInput.value;
      const userAgent = userAgentInput.value;
  
      chrome.storage.local.set({ enabled, timezone, userAgent }, () => {
        alert('Settings saved!');
      });
    });
  });