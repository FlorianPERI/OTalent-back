import Debug from 'debug';
import WebSocket from 'ws';

const debug = Debug('app:websocket');

describe('WebSocket Server', () => {
  let client;

  beforeEach(() => {
    debug('Connecting to WebSocket server');
    client = new WebSocket('ws://localhost:3000/ws');
  });

  afterEach(() => {
    debug('Disconnecting from WebSocket server');
    client.close();
  });

  test('should handle getAllMessages message', (done) => {
    client.on('open', () => {
      client.send(JSON.stringify({ type: 'getAllMessages' }));
    });

    client.on('message', (message) => {
      debug(message);
      const messages = JSON.parse(message);
      expect(messages).toEqual(expect.any(Array));
      done();
    });
  });

  setTimeout(done, 1000);
});
