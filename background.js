// Set 'enabled' to false in storage when the extension is first loaded
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({'enabled': false});
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.get('enabled', function(result) {
      chrome.tabs.sendMessage(tabId, {action: "toggle", enabled: result.enabled});
    });
  }
});
