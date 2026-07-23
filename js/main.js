document.getElementById('year').textContent = new Date().getFullYear();

const essayForm = document.getElementById('essay-form');
if (essayForm) {
  const topicField = document.getElementById('essay-topic');
  const maxArticoliField = document.getElementById('essay-max-articoli');
  const annoField = document.getElementById('essay-anno');
  const submitBtn = essayForm.querySelector('.essay-form__submit');
  const hint = document.getElementById('essay-hint');
  const result = document.getElementById('essay-result');

  essayForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const tema = topicField.value.trim();

    if (!tema) {
      essayForm.dataset.state = 'error';
      hint.textContent = 'Indica un tema di ricerca.';
      topicField.focus();
      return;
    }

    essayForm.dataset.state = 'loading';
    submitBtn.disabled = true;
    hint.textContent = "L'agente sta cercando e analizzando gli articoli — può richiedere alcuni minuti, resta su questa pagina…";
    result.hidden = true;
    result.textContent = '';

    const payload = {
      tema,
      max_articoli: parseInt(maxArticoliField.value, 10) || 4,
    };
    if (annoField.value) payload.anno = parseInt(annoField.value, 10);

    try {
      const res = await fetch('/api/agente-ricerca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore nella generazione.');
      }

      essayForm.dataset.state = 'success';
      hint.textContent = 'Saggio generato. Verificalo sempre prima dell\'uso.';
      result.hidden = false;
      result.innerHTML = '';

      const titleEl = document.createElement('p');
      titleEl.className = 'essay-result__title';
      titleEl.textContent = data.titolo_saggio || 'Saggio generato';
      result.appendChild(titleEl);

      if (typeof data.articoli_analizzati === 'number') {
        const metaEl = document.createElement('p');
        metaEl.className = 'essay-result__meta';
        metaEl.textContent = `${data.articoli_analizzati} articoli analizzati`;
        result.appendChild(metaEl);
      }

      if (data.pdf) {
        const link = document.createElement('a');
        link.className = 'contact-link';
        link.href = data.pdf;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Scarica il PDF';
        result.appendChild(link);
      }
    } catch (err) {
      essayForm.dataset.state = 'error';
      hint.textContent = err.message || 'Errore imprevisto. Riprova.';
    } finally {
      submitBtn.disabled = false;
    }
  });

  topicField.addEventListener('input', () => {
    if (essayForm.dataset.state === 'error') {
      essayForm.dataset.state = '';
      hint.textContent = '';
    }
  });
}
