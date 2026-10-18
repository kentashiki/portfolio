(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const endpoint = window.portfolioContactEndpoint;
  // Until configured, keep the fields hidden and prevent any same-page POST.
  const ready = typeof endpoint === 'string'
    && /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/i.test(endpoint);
  if (!ready) {
    form.addEventListener('submit', (event) => event.preventDefault());
    return;
  }

  const ja = document.body.dataset.locale === 'ja';
  const labels = ja
    ? { name: 'お名前', email: 'メールアドレス', subject: '件名', message: 'お問い合わせ内容' }
    : { name: 'name', email: 'email address', subject: 'subject', message: 'message' };
  const fields = [...form.querySelectorAll('input, textarea')];
  const errors = new Map();
  let submitted = false;
  const summary = document.createElement('p');
  summary.className = 'contact-form-error';
  summary.setAttribute('role', 'alert');
  summary.hidden = true;
  form.querySelector('[type="submit"]').before(summary);

  function messageFor(field) {
    if (field.required && !field.value.trim()) {
      return ja ? `${labels[field.name]}を入力してください。` : `Please enter your ${labels[field.name]}.`;
    }
    if (field.validity.typeMismatch) {
      return ja ? 'メールアドレスの形式をご確認ください。' : 'Please enter a valid email address.';
    }
    if (field.maxLength > 0 && field.value.length > field.maxLength) {
      return ja ? `${field.maxLength}文字以内で入力してください。` : `Please use ${field.maxLength} characters or fewer.`;
    }
    return field.validity.valid ? '' : (ja ? '入力内容をご確認ください。' : 'Please check this field.');
  }

  function validate(field) {
    const message = messageFor(field);
    const error = errors.get(field);
    error.textContent = message;
    error.hidden = !message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return !message;
  }

  function updateSummary() {
    const count = fields.filter((field) => field.getAttribute('aria-invalid') === 'true').length;
    summary.hidden = count === 0;
    summary.textContent = count
      ? (ja ? `${count}項目の入力内容をご確認ください。` : `Please check ${count} ${count === 1 ? 'field' : 'fields'}.`)
      : '';
  }

  fields.forEach((field) => {
    const error = document.createElement('p');
    error.id = `${field.id}-error`;
    error.className = 'contact-field-error';
    error.hidden = true;
    field.after(error);
    field.setAttribute('aria-describedby', error.id);
    errors.set(field, error);
    field.addEventListener('input', () => {
      if (!submitted) return;
      validate(field);
      updateSummary();
    });
  });

  // Show concise inline errors instead of the browser's validation popover.
  form.noValidate = true;
  form.addEventListener('submit', (event) => {
    submitted = true;
    const invalid = fields.filter((field) => !validate(field));
    updateSummary();
    if (invalid.length) {
      event.preventDefault();
      invalid[0].focus();
    }
  });

  // Use native POST so Formspree can handle CAPTCHA and its confirmation page.
  form.action = endpoint;
  form.querySelector('[type="submit"]').disabled = false;
  form.hidden = false;
  document.getElementById('contact-form-notice').textContent = ja
    ? '送信にはFormspreeを利用しています。送信するとFormspreeの確認画面に移動します。'
    : 'Messages are sent via Formspree. Submitting this form takes you to its confirmation page.';
})();
