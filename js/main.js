document.getElementById('year').textContent = new Date().getFullYear();

const essayForm = document.getElementById('essay-form');
if (essayForm) {
  const topicField = document.getElementById('essay-topic');
  const filesField = document.getElementById('essay-files');
  const pasteField = document.getElementById('essay-paste');
  const submitBtn = essayForm.querySelector('.essay-form__submit');
  const hint = document.getElementById('essay-hint');
  const result = document.getElementById('essay-result');

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(`Impossibile leggere ${file.name}`));
      reader.readAsText(file);
    });
  }

  essayForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = topicField.value.trim();
    const pasted = pasteField.value.trim();
    const files = Array.from(filesField.files || []);

    if (!topic) {
      essayForm.dataset.state = 'error';
      hint.textContent = 'Indica un argomento di ricerca.';
      topicField.focus();
      return;
    }

    if (!pasted && files.length === 0) {
      essayForm.dataset.state = 'error';
      hint.textContent = 'Carica almeno un documento o incolla del testo: l\'assistente scrive solo dai tuoi materiali.';
      return;
    }

    essayForm.dataset.state = 'loading';
    submitBtn.disabled = true;
    hint.textContent = 'Elaborazione in corso — può richiedere qualche istante…';
    result.hidden = true;
    result.textContent = '';

    try {
      const documents = [];
      if (pasted) {
        documents.push({ name: 'testo incollato', text: pasted });
      }
      for (const file of files) {
        documents.push({ name: file.name, text: await readFileAsText(file) });
      }

      const res = await fetch('/api/genera-saggio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, documents }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore nella generazione.');
      }

      essayForm.dataset.state = 'success';
      hint.textContent = 'Bozza generata. Verificane sempre le fonti prima di usarla.';
      result.hidden = false;
      result.textContent = data.essay;
    } catch (err) {
      essayForm.dataset.state = 'error';
      hint.textContent = err.message || 'Errore imprevisto. Riprova.';
    } finally {
      submitBtn.disabled = false;
    }
  });

  [topicField, pasteField].forEach((field) => {
    field.addEventListener('input', () => {
      if (essayForm.dataset.state === 'error') {
        essayForm.dataset.state = '';
        hint.textContent = '';
      }
    });
  });
}
