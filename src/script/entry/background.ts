
chrome.runtime.onMessage.addListener((message: {
    action: "fetch",
    url: string
}, sender, sendResponse) => {
    let url = message.url;
    if (message.action === 'fetch') {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = function () {
                    sendResponse({ data: reader.result });
                };
                reader.readAsDataURL(blob); // Converts blob to base64 for easy transport
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true; // Indicates that the response is asynchronous
    }
});

