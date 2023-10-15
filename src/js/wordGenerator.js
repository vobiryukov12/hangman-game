export const wordGenerator = (controller) => {
  return fetch('/.netlify/functions/getWord', {
    signal: controller.signal
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
