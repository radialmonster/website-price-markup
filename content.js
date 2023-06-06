// Function to check if a node contains a price and replace it if necessary
function replacePrices(node) {
    chrome.storage.local.get(['markupValue', 'markupAmount', 'enabled'], function(result) {
      if (result.enabled) {
        var markupValue = parseFloat(result.markupValue);
        var markupAmount = parseFloat(result.markupAmount);
        var priceRegex = /\$\d+(\.\d{1,2})?/g;
        var newText = node.textContent.replace(priceRegex, function(match) {
          var oldPrice = parseFloat(match.substring(1));
          var newPrice = Math.max(oldPrice * (1 + markupValue / 100), oldPrice + markupAmount);
          return "$" + newPrice.toFixed(2) + "*";
        });
        node.textContent = newText;
      }
    });
  }
  
  // Function to walk through the document tree
  function documentWalker(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      replacePrices(node);
    } else {
      for (var childNode of node.childNodes) {
        documentWalker(childNode);
      }
    }
  }
  
  // MutationObserver to react to changes in the DOM
  var observer = new MutationObserver(function(mutations) {
    for (var mutation of mutations) {
      for (var addedNode of mutation.addedNodes) {
        documentWalker(addedNode);
      }
    }
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "toggle") {
      chrome.storage.local.get('enabled', function(result) {
        if (result.enabled) {
          documentWalker(document.body);
          observer.observe(document.body, {childList: true, subtree: true});
        } else {
          location.reload();
        }
      });
    }
  });
  