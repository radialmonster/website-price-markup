var observer = new MutationObserver(function(mutations) {
  for (var mutation of mutations) {
    for (var addedNode of mutation.addedNodes) {
      documentWalker(addedNode);
    }
  }
});

var originalBodyHTML = null;

function replacePrices(node, markupValue, markupAmount) {
  var dollarRegex = /\$/g;
  var newPriceRegex = /\d+\.\d{1,2}/g; // Only consider numbers with a decimal point
  var newText;

  if (node.textContent.match(dollarRegex)) {
      var nextSibling = node.nextSibling;
      if (nextSibling && nextSibling.textContent.match(newPriceRegex)) {
          nextSibling.textContent = nextSibling.textContent.replace(newPriceRegex, function(match) {
              var oldPrice = parseFloat(match);
              var newPrice = Math.max(oldPrice * (1 + markupValue / 100), oldPrice + markupAmount);
              console.log('Replacing price:', oldPrice, 'with:', newPrice);
              return newPrice.toFixed(2) + "*";
          });
      }
  } else if (node.textContent.match(newPriceRegex)) {
      var prevSibling = node.previousSibling;
      if (prevSibling && prevSibling.textContent.match(dollarRegex)) {
          newText = node.textContent.replace(newPriceRegex, function(match) {
              var oldPrice = parseFloat(match);
              var newPrice = Math.max(oldPrice * (1 + markupValue / 100), oldPrice + markupAmount);
              console.log('Replacing price:', oldPrice, 'with:', newPrice);
              return newPrice.toFixed(2) + "*";
          });
      }
  }

  if (newText) {
      node.textContent = newText;
  }
}


// Function to walk through the document tree
function documentWalker(node, markupValue, markupAmount) {
  if (node.nodeType === Node.TEXT_NODE) {
      replacePrices(node, markupValue, markupAmount);
  } else {
      for (var childNode of node.childNodes) {
          documentWalker(childNode, markupValue, markupAmount);
      }
  }
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Received message:', request);
  if (request.action == "toggle") {
    if (request.enabled) {
      chrome.storage.local.get(['markupValue', 'markupAmount'], function(result) {
        var markupValue = parseFloat(result.markupValue);
        var markupAmount = parseFloat(result.markupAmount);
        originalBodyHTML = document.body.innerHTML;
        documentWalker(document.body, markupValue, markupAmount);
        observer.observe(document.body, {childList: true, subtree: true});
      });
    } else {
      observer.disconnect();
      if (originalBodyHTML !== null) {
        document.body.innerHTML = originalBodyHTML;
      }
    }
  }
});
