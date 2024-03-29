chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getPromptsForCurrentTab") {
    // Forward the request to the content script of the current tab
    chrome.tabs.sendMessage(
      request.tabId,
      { action: "getPrompts" },
      function (response) {
        // Forward the response from the content script to the popup
        chrome.runtime.sendMessage({
          action: "displayPrompts",
          prompts: response ? response.prompts : [],
        });
      },
    );
  }
});
