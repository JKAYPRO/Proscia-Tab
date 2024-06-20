document.getElementById('openUrl').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value;
    if (isValidUrl(url)) {
      chrome.runtime.sendMessage({ action: 'openOrRefreshTab', url: url }, (response) => {
        console.log(response.status);
      });
    } else {
      alert('Please enter a valid URL.');
    }
  });
  
  // Function to validate the URL
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }
  