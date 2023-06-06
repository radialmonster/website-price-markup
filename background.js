chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      chrome.storage.local.get('enabled', function(result) {
        if (result.enabled) {
          chrome.tabs.sendMessage(tabId, {action: "toggle"});
        }
      });
    }
  });
  