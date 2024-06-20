document.getElementById('setDomain').addEventListener('click', () => {
    const domain = document.getElementById('domainInput').value;
    if (domain) {
      chrome.runtime.sendMessage({ action: 'updateDomain', domain: domain }, (response) => {
        console.log(response.status);
      });
    }
  });
  