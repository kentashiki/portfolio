(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const ja = document.body.dataset.locale === 'ja';
  const text = ja ? {
    ready: '共同研究やプロダクト開発について、こちらのフォームからお問い合わせください。',
    sending: '送信しています…',
    sent: 'お問い合わせを送信しました。ご連絡ありがとうございます。',
    button: '送信する',
    sentButton: '送信しました',
    validation: '入力内容をご確認ください。文字数やメールアドレスの形式に誤りがあります。',
    rate: '送信回数の上限に達しました。時間をおいてからお試しください。',
    too_fast: '少し時間をおいてから、もう一度送信してください。',
    session: '送信の準備を更新しました。入力内容を確認し、もう一度送信してください。',
    unavailable: '現在フォームを利用できません。下のSNSからご連絡ください。',
    error: '送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。',
    uncertain: '送信結果を確認できませんでした。入力内容は残っています。時間をおいて、もう一度送信してください。',
  } : {
    ready: 'Use this form to get in touch about research or product development.',
    sending: 'Sending…',
    sent: 'Your message has been sent. Thank you for getting in touch.',
    button: 'Send message',
    sentButton: 'Message sent',
    validation: 'Please check the fields, character limits, and email address.',
    rate: 'The submission limit has been reached. Please try again later.',
    too_fast: 'Please wait a moment, then try sending again.',
    session: 'The form session has been refreshed. Please review your message and send again.',
    unavailable: 'This form is currently unavailable. Please use the social links below.',
    error: 'Your message could not be sent. Your text has been kept. Please try again later.',
    uncertain: 'We could not confirm the result. Your text has been kept. Please wait and try sending again.',
  };
  const notice = document.getElementById('contact-form-notice');
  const button = form.querySelector('[type="submit"]');
  let token = '';
  let busy = false;
  let sent = false;

  function show(message, state = '') {
    notice.textContent = message;
    notice.dataset.state = state;
  }

  async function request(options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.method === 'POST' ? 45000 : 10000);
    try {
      const response = await fetch(form.action, {
        credentials: 'same-origin',
        cache: 'no-store',
        ...options,
        headers: { Accept: 'application/json', ...options.headers },
        signal: controller.signal,
      });
      return { response, data: await response.json() };
    } finally {
      clearTimeout(timeout);
    }
  }

  async function connect() {
    const { response, data } = await request();
    if (!response.ok || !data.ok || typeof data.token !== 'string' || !/^[a-f0-9]{64}$/.test(data.token)) {
      throw new Error('Form unavailable');
    }
    token = data.token;
    button.disabled = false;
  }

  // Keep Enter and scripted submit events inert until the PHP handshake succeeds.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!token || busy || sent || !form.reportValidity()) return;
    busy = true;
    button.disabled = true;
    button.textContent = text.sending;
    form.setAttribute('aria-busy', 'true');
    show(text.sending);
    const values = Object.fromEntries(new FormData(form));
    const fields = [...form.querySelectorAll('input, textarea')];
    fields.forEach((field) => { field.readOnly = true; });
    try {
      const { response, data } = await request({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, token }),
      });
      if (response.ok && data.ok) {
        sent = true;
        form.reset();
        show(text.sent, 'success');
      } else if (data.code === 'session') {
        token = '';
        await connect();
        show(text.session, 'error');
      } else {
        show(text[data.code] || text.error, 'error');
      }
    } catch {
      // Retrying the same challenge and payload is idempotent on the server.
      show(text.uncertain, 'error');
    } finally {
      busy = false;
      form.removeAttribute('aria-busy');
      fields.forEach((field) => { field.readOnly = false; });
      button.disabled = sent || !token;
      button.textContent = sent ? text.sentButton : text.button;
    }
  });

  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  const production = ['kentashiki.com', 'www.kentashiki.com'].includes(location.hostname)
    && location.protocol === 'https:';
  // GitHub Pages never calls a PHP endpoint or enables this form.
  if (!local && !production) return;
  connect().then(() => show(text.ready)).catch(() => {
    // Leave the existing preparation notice and disabled button in place.
  });
})();
