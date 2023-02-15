export function ws(url: string) {
  const conn = new WebSocket(url);
  return {
    on: function (operation: string, callback: (msg: Event | string) => void) {
      const operationCallback = (event: Event) => callback(event);
      switch (operation) {
        case "open":
          conn.onopen = operationCallback;
          break;
        case "close":
          conn.onclose = operationCallback;
          break;
        case "error":
          conn.onerror = operationCallback;
          break;
        case "message":
          conn.onmessage = (event: MessageEvent) => callback(event.data);
          break;
      }
    },
    send: function (msg: string) {
      conn.send(msg);
    },
    terminate: function (code?: number, reason?: string) {
      conn.close(code, reason);
    },
    getConnection: function () {
      return conn;
    },
  };
}
