// Simulated serial-monitor boot sequence in the hero panel.
(function () {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  const lines = [
    { text: 'connecting to portfolio... ', tail: 'OK' },
    { text: 'loading profile... ', tail: 'OK' },
    { text: 'role: frontend + python/cv + embedded' },
    { text: 'location: Lagos, NG (UTC+01:00)' }
  ];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function appendCursor(target) {
    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    target.appendChild(cursor);
  }

  function renderStatic() {
    body.innerHTML = '';
    lines.forEach((line) => {
      const p = document.createElement('p');
      p.innerHTML = '<span class="term-prompt">&gt;</span> ' + line.text + (line.tail ? line.tail : '');
      body.appendChild(p);
    });
    const status = document.createElement('p');
    status.className = 'term-status';
    status.textContent = 'STATUS: ONLINE ●';
    appendCursor(status);
    body.appendChild(status);
  }

  if (prefersReducedMotion) {
    renderStatic();
    return;
  }

  body.innerHTML = '';
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      const status = document.createElement('p');
      status.className = 'term-status';
      status.textContent = 'STATUS: ONLINE ●';
      appendCursor(status);
      body.appendChild(status);
      return;
    }

    const line = lines[lineIndex];
    const p = document.createElement('p');
    const prompt = document.createElement('span');
    prompt.className = 'term-prompt';
    prompt.textContent = '> ';
    p.appendChild(prompt);
    const textSpan = document.createElement('span');
    p.appendChild(textSpan);
    body.appendChild(p);

    let charIndex = 0;
    const fullText = line.text;

    function typeChar() {
      if (charIndex < fullText.length) {
        textSpan.textContent += fullText[charIndex];
        charIndex++;
        setTimeout(typeChar, 14);
      } else if (line.tail) {
        setTimeout(() => {
          textSpan.textContent += line.tail;
          lineIndex++;
          setTimeout(typeLine, 220);
        }, 180);
      } else {
        lineIndex++;
        setTimeout(typeLine, 220);
      }
    }
    typeChar();
  }

  typeLine();
})();
