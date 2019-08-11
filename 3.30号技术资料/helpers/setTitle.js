const setTitle = (title) => {
  const src = '/favicon.ico';
  const body = document.body;
  document.title = title; // hack在微信等webview中无法修改document.title的情况
  const $iframe = document.createElement('iframe');
  $iframe.src = src;
  $iframe.style.display = 'none';
  $iframe.onload = () => {
    setTimeout(() => {
      $iframe.onload = null;
      body.removeChild($iframe);
    }, 0);
  };
  body.appendChild($iframe);
};

export default setTitle;
