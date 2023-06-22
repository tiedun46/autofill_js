chrome.runtime.onInstalled.addListener(({ reason, version }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      showReadme();
    }
  });
  
  function showReadme(info, tab) {
    let url = chrome.runtime.getURL("readme.html");
    chrome.tabs.create({ url });
  }