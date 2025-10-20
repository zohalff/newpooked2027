// ... earlier content ...

// --------- Service Worker registration (optional) ---------
if ('serviceWorker' in navigator) {
  try {
    // Use relative path so registration works when served from a folder
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  } catch(e){}
}