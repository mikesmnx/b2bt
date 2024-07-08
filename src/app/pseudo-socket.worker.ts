/// <reference lib="webworker" />

let timerId: any = null;

addEventListener('message', ({ data }) => {
  const { command, timeout } = data;

  if (command === 'start' && timeout) {
    if (timerId === null) {
      timerId = setInterval(() => {
        postMessage('Worker is pushing a message');
      }, timeout);
    }
  } else if (command === 'stop') {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
      postMessage('Worker has stopped');
    }
  }
});
