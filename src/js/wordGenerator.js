export const wordGenerator = (controller) => {
  return fetch('https://api.openai.com/v1/chat/completions', {
    signal: controller.signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_APP_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Generate one word' }]
    })
  })
    .then((response) => response.json())
    .then((data) => data.choices)
    .catch(error => {
      if (error.name === 'AbortError') {
        console.log('Fetch request aborted');
      } else {
        console.error('Fetch request failed:', error);
      }
    });
};
