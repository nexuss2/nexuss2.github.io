(() => {
  const panicKey = (localStorage.getItem('panicKey') || '').toLowerCase();
  let panicUrl = localStorage.getItem('panicUrl');

  if (!panicKey || !panicUrl) return;

  if (!panicUrl.startsWith('http://') && !panicUrl.startsWith('https://')) {
    panicUrl = 'https://' + panicUrl;
  }

  window.addEventListener('keydown', (event) => {
    const tag = document.activeElement.tagName;

    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (event.key.toLowerCase() === panicKey) {
      event.preventDefault();
      window.top.location.href = panicUrl;
    }
  });
})();
