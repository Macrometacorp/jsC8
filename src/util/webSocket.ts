const socketConn = require('ws');

export function ws(url: string) {
    return new socketConn(url);
}