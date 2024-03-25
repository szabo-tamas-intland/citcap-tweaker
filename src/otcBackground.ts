import { MESSAGE_KEYS } from "./messages";

chrome.webRequest.onCompleted.addListener(
  async (...args) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    chrome.tabs.sendMessage(tab.id!, {
      key: MESSAGE_KEYS.OTC_OFFERS_REQUEST_FINISHED,
    });
  },
  { urls: ["*://*/api/otc/offers/*"] }
);

chrome.webRequest.onCompleted.addListener(
  async (...args) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    chrome.tabs.sendMessage(tab.id!, {
      key: MESSAGE_KEYS.OTC_HISITORY_REQUEST_FINISHED,
    });
  },
  { urls: ["*://*/api/otc/history/*"] }
);
