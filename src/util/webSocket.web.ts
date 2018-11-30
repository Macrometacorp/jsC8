export function ws(url: string) {
    const conn = new WebSocket(url);
    return {
        on: function (operation: string, callback: (msg: any) => void) {
            switch (operation) {
                case 'open':
                    conn.onopen = (event) => { callback(event) };
                    break;
                case 'close':
                    conn.onclose = (event) => { callback(event) };
                    break;
                case 'error':
                    conn.onerror = (event) => { callback(event); };
                    break;
                case 'message':
                    conn.onmessage = (event) => { callback(event) };
                    break;
            }
        },
        send: function (msg: string) {
            conn.send(msg);
        },
        terminate: function (code?: number, reason?: string) {
            conn.close(code, reason);
        },
        getConnection: function () { return conn; }
    }
}