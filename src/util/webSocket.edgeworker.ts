export function wsEdgeWorker(url: string) {
  const webSocketUrl = url.replace("wss:", "https:");

  const [client, server]: any = Object.values(new WebSocketPair());

  return fetch(webSocketUrl, { headers: { upgrade: "websocket" } })
    .then((webSocketConnection: any) => {
      if (webSocketConnection.status !== 101) {
        throw new Error("Failed to establish websocket connection");
      }

      const webSocket = webSocketConnection.webSocket;
      server.accept();
      webSocket.accept();

      server.addEventListener("message", (message: MessageEvent) =>
        webSocket.send(message.data)
      );
      server.addEventListener("error", () => webSocket.close());

      webSocket.addEventListener("message", (event: MessageEvent) =>
        server.send(event.data)
      );
      webSocket.addEventListener("error", () => server.close());
      webSocket.addEventListener("close", () => server.close());

      return client;
    })
    .catch(error => {
      server.close();
      return error;
    });
}
