document.getElementById('enable-markup').addEventListener('click', function() {
    var markupValue = document.getElementById('markup-value').value;
    var markupAmount = document.getElementById('markup-amount').value;
    chrome.storage.local.set({'markupValue': markupValue, 'markupAmount': markupAmount, 'enabled': true}, function() {
      chrome.tabs.query({}, function(tabs) {
        for(let tab of tabs){
          chrome.tabs.sendMessage(tab.id, {action: "toggle"});
        }
      });
    });
  });
  
  document.getElementById('disable-markup').addEventListener('click', function() {
    chrome.storage.local.set({'enabled': false}, function() {
      chrome.tabs.query({}, function(tabs) {
        for(let tab of tabs){
          chrome.tabs.sendMessage(tab.id, {action: "toggle"});
        }
      });
    });
  });
  