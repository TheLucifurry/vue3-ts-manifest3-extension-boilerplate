/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */

// import { getActiveTab } from '@/helpers/utils';

console.log('Started');
self.addEventListener('install', (event) => {
  // self.skipWaiting();
  console.log('Installed', event);
});
self.addEventListener('activate', (event) => {
  console.log('Activated', event);
});
self.addEventListener('push', (event) => {
  console.log('Push message received', event);
});
chrome.action.onClicked.addListener((tab) => {
  console.log('onClicked');
  if (tab?.id == null) return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['cnt.js'],
  });
  chrome.action.setBadgeText({ text: '777', tabId: tab.id });
});
