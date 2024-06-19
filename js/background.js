chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

function saveEndStateAndClearInterval(intervalId, location, message) {
  chrome.storage.local.set({ [location]: message }, () => {
    clearInterval(intervalId);
  });
}

function startTimer(duration, location) {
  let timer = duration;
  const intervalId = setInterval(() => {
    if (--timer < 0) {
      saveEndStateAndClearInterval(intervalId, location, "Timed Out");
    } else {
      chrome.storage.local.set({ [location]: timer });
    }
  }, 1000);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.newTimer) {
    chrome.storage.local.get(null, (items) => {
      Object.entries(items).forEach(([key, value]) => {
        if (key !== "timer" && key !== "custom" && value !== "Finished" && value !== "Timed Out") {
          startTimer(value, key);
        }
      });
    });
  }
});
