// /storage/js/loading.js
document.addEventListener('DOMContentLoaded', function () {
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  const loadingMessages = [
    'made with love from the Interstellar 3.1 team <3 (just me)',
    'are the 19:36?',
    'boiiii what u say about ajh phonk',
    'are you sure?',
    'this is like technically release games v7 if you think about it',
    'æ³£ããŸããªã£ã¦ã‚‚ ãã‚Œã§ã‚‚ ã‹ãé›†ã‚',
    'pixel jeff the goat',
    'pablocp kinda tuff',
    '"sealiee1 would want my milkshakes" - frogiee1',
    'also try jobi.one',
    'today is 30/30',
    '"watch hfjone, it changed my life" - prolly someone',
    'young pokeballer i just leveled up',
    '+1 (475) 266-9223',
    'windows update fucked up my ssd ðŸ˜­',
    'Life only begins once you realize what you want to be.',
    'Some dance to remember, others dance to forget.',
    'hache tml',
    '"how to setup aws cloudflare"',
    'bog has a good site',
    'rest in pork lil bro',
    'when bro asks for one hawk tuah',
    'gurt: yo',
  ];

  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'black';
  overlay.style.zIndex = '9999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  const spinner = document.createElement('div');
  spinner.style.width = '60px';
  spinner.style.height = '60px';
  spinner.style.border = '8px solid #333';
  spinner.style.borderTop = '8px solid white';
  spinner.style.borderRadius = '50%';
  spinner.style.animation = 'spin 1s linear infinite';

  const poweredText = document.createElement('div');
  poweredText.textContent = randomMessage;
  poweredText.style.color = 'white';
  poweredText.style.marginTop = '16px';
  poweredText.style.fontSize = '15px';
  poweredText.style.fontFamily = "'Poppins', sans-serif";

  const skipButton = document.createElement('button');
  skipButton.textContent = 'Skip';
  skipButton.style.position = 'absolute';
  skipButton.style.bottom = '20px';
  skipButton.style.right = '20px';
  skipButton.style.padding = '6px 12px';
  skipButton.style.fontSize = '14px';
  skipButton.style.cursor = 'pointer';
  skipButton.style.display = 'none';
  skipButton.style.backgroundColor = '#222';
  skipButton.style.border = 'none';
  skipButton.style.borderRadius = '6px';
  skipButton.style.color = '#fff';
  skipButton.style.pointerEvents = 'auto';

  skipButton.addEventListener('click', removeOverlay);

  const styleSheet = document.createElement('style');
  styleSheet.innerHTML = `
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);

  overlay.appendChild(spinner);
  overlay.appendChild(poweredText);
  overlay.appendChild(skipButton);
  document.body.appendChild(overlay);

  function removeOverlay() {
    overlay.style.transition = 'opacity 0.5s';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 700);
  }

  const skipTimeout = setTimeout(() => {
    skipButton.style.display = 'block';
  }, 2000);

  window.onload = function () {
    clearTimeout(skipTimeout);
    removeOverlay();
  };
});
