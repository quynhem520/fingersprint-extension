chrome.runtime.onInstalled.addListener(() => {
    console.log("User-Agent Tool installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateUA") {
        const { userAgent } = message;
        updateUserAgent(userAgent);
        updateContentScriptUserAgent(userAgent);
    } else if (message.action === "toggleUA") {
        const { enabled } = message;
        toggleUserAgent(enabled);
    }
    sendResponse({ status: "done" });
});

function updateUserAgent(userAgent) {
    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            for (let header of details.requestHeaders) {
                if (header.name.toLowerCase() === "user-agent") {
                    header.value = userAgent;
                }
            }
            return { requestHeaders: details.requestHeaders };
        },
        { urls: ["<all_urls>"] },
        ["blocking", "requestHeaders"]
    );
}

function updateContentScriptUserAgent(userAgent) {
    chrome.tabs.query({}, function(tabs) {
        for (let tab of tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: setUserAgent,
                args: [userAgent]
            });
        }
    });
}

function setUserAgent(userAgent) {
    Object.defineProperty(navigator, 'userAgent', {
        value: userAgent,
        configurable: false,
        enumerable: true,
        writable: false
    });
}

function toggleUserAgent(enabled) {
    if (enabled) {
        chrome.webRequest.onBeforeSendHeaders.addListener(
            function (details) {
                chrome.storage.local.get("userAgent", function (data) {
                    const userAgent = data.userAgent || "";
                    for (let header of details.requestHeaders) {
                        if (header.name.toLowerCase() === "user-agent") {
                            header.value = userAgent;
                        }
                    }
                    return { requestHeaders: details.requestHeaders };
                });
            },
            { urls: ["<all_urls>"] },
            ["blocking", "requestHeaders"]
        );
    } else {
        chrome.webRequest.onBeforeSendHeaders.removeListener(handleRequest);
    }
}

function handleRequest(details) {
    chrome.storage.local.get("userAgent", function (data) {
        const userAgent = data.userAgent || "";
        for (let header of details.requestHeaders) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = userAgent;
            }
        }
        return { requestHeaders: details.requestHeaders };
    });
}