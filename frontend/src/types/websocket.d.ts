declare module 'stompjs' {
  export interface Frame {
    command: string;
    headers: { [key: string]: string };
    body: string;
  }

  export interface Message {
    command: string;
    headers: { [key: string]: string };
    body: string;
    ack(headers?: { [key: string]: string }): void;
    nack(headers?: { [key: string]: string }): void;
  }

  export interface Subscription {
    id: string;
    unsubscribe(): void;
  }

  export interface Client {
    connected: boolean;
    counter: number;
    heartbeat: {
      incoming: number;
      outgoing: number;
    };
    maxWebSocketFrameSize: number;
    subscriptions: { [id: string]: (message: Message) => void };
    ws: WebSocket;

    debug: ((message: string) => void) | null;

    connect(
      headers: { [key: string]: string },
      connectCallback: (frame: Frame) => void,
      errorCallback?: (error: Frame | string) => void
    ): void;

    disconnect(disconnectCallback: () => void, headers?: { [key: string]: string }): void;

    send(destination: string, headers?: { [key: string]: string }, body?: string): void;

    subscribe(
      destination: string,
      callback: (message: Message) => void,
      headers?: { [key: string]: string }
    ): Subscription;

    unsubscribe(id: string): void;

    begin(transaction: string): {
      id: string;
      commit(): void;
      abort(): void;
    };

    commit(transaction: string): void;

    abort(transaction: string): void;

    ack(messageID: string, subscription: string, headers?: { [key: string]: string }): void;

    nack(messageID: string, subscription: string, headers?: { [key: string]: string }): void;
  }

  export function client(url: string): Client;
  export function over(ws: WebSocket | any): Client;
}

declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: {
      server?: string;
      transports?: string | string[];
      sessionId?: number | (() => string);
    });
    
    close(code?: number, reason?: string): void;
    send(data: string): void;
    
    onopen: ((e: Event) => void) | null;
    onclose: ((e: CloseEvent) => void) | null;
    onmessage: ((e: MessageEvent) => void) | null;
    onerror: ((e: Event) => void) | null;
    
    readyState: number;
    protocol: string;
    url: string;
    
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
  }
}
