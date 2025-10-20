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
    if (
      typeof event.data === 'object' &&
      event.data !== null &&
      'type' in event.data &&
      (event.data as { type: string }).type === 'devvit-message'
    ) {
      callback(event.data as DevvitSystemMessage);
    }
  };

  window.addEventListener('message', handler);

  // Return cleanup function
  return () => window.removeEventListener('message', handler);
}
