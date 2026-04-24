/* ============================================================
   script.js — Site Romântico para Gabby 💖
   ============================================================ */

/* =====================================================
   1. ANIMAÇÃO DE CORAÇÕES NO CANVAS
   ===================================================== */
(function initHearts() {
  const canvas = document.getElementById('hearts-canvas');
  const ctx    = canvas.getContext('2d');

  // Ajusta o canvas ao tamanho da janela
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Classe de cada coração flutuante
  class Heart {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * canvas.width;
      this.y     = initial
        ? Math.random() * canvas.height   // posição aleatória inicial
        : canvas.height + 30;             // começa abaixo da tela

      this.size  = Math.random() * 18 + 8;          // 8–26 px
      this.speed = Math.random() * 0.8 + 0.4;       // velocidade de subida
      this.opacity = Math.random() * 0.45 + 0.1;    // 0.10–0.55
      this.drift = (Math.random() - 0.5) * 0.6;     // oscilação lateral
      this.wobble = Math.random() * Math.PI * 2;     // fase de oscilação
    }

    // Desenha o símbolo ♥ usando bezier curves
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);

      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s, -s * 0.3, -s * 1.4,  s * 0.6, 0, s * 1.2);
      ctx.bezierCurveTo( s * 1.4,  s * 0.6,  s, -s * 0.3, 0, s * 0.3);

      // Cor alternada entre tons de rosa
      const hue = Math.random() > 0.5 ? '#e8637a' : '#f4a9bb';
      ctx.fillStyle = hue;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.wobble += 0.025;
      this.x += Math.sin(this.wobble) * this.drift;
      this.y -= this.speed;

      // Reinicia quando sai pelo topo
      if (this.y < -40) this.reset();
    }
  }

  // Cria um conjunto de corações
  const HEART_COUNT = 28;
  const hearts = Array.from({ length: HEART_COUNT }, () => new Heart());

  // Loop de animação
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => { h.update(); h.draw(); });
    requestAnimationFrame(animate);
  }

  animate();
})();


/* =====================================================
   2. BOTÃO "NÃO" — FOGE DO CURSOR
   ===================================================== */
const btnNo = document.getElementById('btn-no');

// Posiciona o botão na tela depois que o card aparece
function positionNoButton() {
  const rect = btnNo.getBoundingClientRect();
  // Se ainda não foi posicionado via JS, define posição inicial real
  if (!btnNo._positioned) {
    btnNo.style.left = rect.left + window.scrollX + 'px';
    btnNo.style.top  = rect.top  + window.scrollY + 'px';
    btnNo._positioned = true;
  }
}

// Faz o botão fugir quando o mouse se aproximar
function runAway(btn) {
  positionNoButton();

  const margin = 30; // distância de fuga (px)
  const vw     = window.innerWidth;
  const vh     = window.innerHeight;
  const w      = btn.offsetWidth;
  const h      = btn.offsetHeight;

  // Posição aleatória dentro da viewport, longe do cursor
  let newX, newY;
  const attempts = 8;

  for (let i = 0; i < attempts; i++) {
    newX = Math.random() * (vw - w - margin * 2) + margin;
    newY = Math.random() * (vh - h - margin * 2) + margin + window.scrollY;

    // Verifica se a nova posição está longe o suficiente do botão SIM
    const yesBtn = document.getElementById('btn-yes');
    const yr = yesBtn.getBoundingClientRect();
    const dist = Math.hypot(
      newX - (yr.left + yr.width / 2),
      newY - (yr.top  + yr.height / 2 + window.scrollY)
    );
    if (dist > 100) break; // posição aceitável encontrada
  }

  btn.style.transition = 'left 0.25s ease, top 0.25s ease';
  btn.style.left = newX + 'px';
  btn.style.top  = newY + 'px';
}

// Suporte a toque (mobile)
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  runAway(btnNo);
});

// Posiciona o botão quando a página carrega
window.addEventListener('load', () => {
  // Aguarda a animação de entrada do card (0.9s + 0.3s delay)
  setTimeout(positionNoButton, 1300);
});


/* =====================================================
   3. BOTÃO "SIM" — EXIBE MENSAGEM ROMÂNTICA
   ===================================================== */
function handleYes() {
  const btnWrapper = document.querySelector('.buttons-wrapper');
  const successMsg = document.getElementById('success-msg');
  const question   = document.querySelector('.question');

  // Esconde os botões e a pergunta com suavidade
  btnWrapper.style.transition = 'opacity 0.4s';
  question.style.transition   = 'opacity 0.4s';
  btnWrapper.style.opacity    = '0';
  question.style.opacity      = '0';
  btnNo.style.display         = 'none';

  setTimeout(() => {
    btnWrapper.style.display = 'none';
    question.style.display   = 'none';

    // Exibe a mensagem de sucesso
    successMsg.style.display = 'flex';

    // Dispara chuva intensa de corações comemorativos
    celebrateWithHearts();
  }, 420);
}


/* =====================================================
   4. CELEBRAÇÃO — MAIS CORAÇÕES AO CLICAR SIM
   ===================================================== */
function celebrateWithHearts() {
  // Cria mini-corações que explodem do centro da tela
  const container = document.body;
  const emojis    = ['❤️', '💖', '💗', '💕', '💓', '🌸', '✨'];
  const count     = 24;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      position: fixed;
      left: 50%;
      top: 50%;
      font-size: ${Math.random() * 1.5 + 1}rem;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: burst 1.4s ease-out ${i * 60}ms forwards;
    `;
    container.appendChild(el);

    // Remove após a animação
    setTimeout(() => el.remove(), 1400 + i * 60);
  }

  // Injeta os keyframes de explosão dinamicamente
  if (!document.getElementById('burst-style')) {
    const style = document.createElement('style');
    style.id = 'burst-style';
    style.textContent = `
      @keyframes burst {
        0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
        60%  { opacity: 1; }
        100% {
          opacity: 0;
          transform: translate(
            calc(-50% + ${randomOffset()}),
            calc(-50% + ${randomOffset()})
          ) scale(1.8);
        }
      }
    `;

    // Keyframes únicos por emoji para espalhá-los
    const allKeyframes = Array.from({ length: count }, (_, i) => `
      span:nth-child(${i + 2}) {
        animation-name: burst_${i};
      }
      @keyframes burst_${i} {
        0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
        60%  { opacity: 1; }
        100% {
          opacity: 0;
          transform: translate(
            calc(-50% + ${(Math.random() - 0.5) * 260}px),
            calc(-50% + ${(Math.random() - 0.5) * 260}px)
          ) scale(${Math.random() * 1 + 1.2});
        }
      }
    `).join('\n');

    style.textContent += allKeyframes;
    document.head.appendChild(style);

    // Re-aplica animações individuais
    const spans = document.querySelectorAll('body > span');
    spans.forEach((s, i) => {
      s.style.animation = `burst_${i} 1.4s ease-out ${i * 60}ms forwards`;
    });
  }
}

function randomOffset() {
  return `${(Math.random() - 0.5) * 260}px`;
}
