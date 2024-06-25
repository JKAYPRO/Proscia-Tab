const specifiedDomain = ""; // Proscia URL 
let activeTabId = null;

// Listener for tab updates
chrome.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes(specifiedDomain)) {
    handleTabUpdate(tab);
  }
});

// Listener for tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url && tab.url.includes(specifiedDomain)) {
    handleTabCreation(tab);
  }
});

// Handle messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openOrRefreshTab' && isValidUrl(request.url, specifiedDomain)) {
    handleOpenOrRefresh(request.url);
  }
  sendResponse({ status: "done" });
  return true;
});

// Function to handle tab updates
function handleTabUpdate(tab) {
  if (activeTabId === null || activeTabId === tab.id) {
    activeTabId = tab.id;
  } else {
    chrome.tabs.update(activeTabId, { url: tab.url, active: true });
    chrome.tabs.remove(tab.id);
    showNotification('Tab Updated', 'The URL has been updated in the existing tab.');
  }
}

// Function to handle tab creation
function handleTabCreation(tab) {
  if (activeTabId === null) {
    activeTabId = tab.id;
  } else {
    chrome.tabs.update(activeTabId, { url: tab.url, active: true });
    chrome.tabs.remove(tab.id);
    showNotification('Tab Updated', 'The URL has been updated in the existing tab.');
  }
}

// Function to handle opening or refreshing a tab
function handleOpenOrRefresh(url) {
  if (activeTabId !== null) {
    chrome.tabs.update(activeTabId, { url: url, active: true });
  } else {
    openNewTab(url);
  }
}

// Function to open a new tab with the specified URL
function openNewTab(url) {
  chrome.tabs.create({ url: url, active: true }, (newTab) => {
    activeTabId = newTab.id;
  });
}

// Function to validate the URL
function isValidUrl(url, domain) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes(domain);
  } catch (e) {
    return false;
  }
}

// Function to show notifications
function showNotification(title, message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: title,
    message: message
  });
}

