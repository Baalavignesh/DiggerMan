import type { DevvitSystemMessage, WebViewMessage } from '../../src/message.js';

/**
 * Post a message to Devvit from the web view.
 */
export function postToDevvit(message: WebViewMessage): void {
  window.parent.postMessage(message, '*');
}

/**
 * Listen for messages from Devvit.
 */
export function onDevvitMessage(
  callback: (message: DevvitSystemMessage) => void
): () => void {
  const handler = (event: MessageEvent) => {
    console.log('Raw message event:', event);
    console.log('Event data:', event.data);
    console.log('Event data type:', event.data?.type);

    if (event.data && event.data.type === 'devvit-message') {
      console.log('Calling callback with devvit message');
      callback(event.data as DevvitSystemMessage);
    } else {
      console.log('Message ignored - not a devvit-message');
    }
  };

  window.addEventListener('message', handler);

  // Return cleanup function
  return () => window.removeEventListener('message', handler);
}
