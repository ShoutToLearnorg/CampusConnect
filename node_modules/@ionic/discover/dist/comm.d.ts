/// <reference types="node" />
import * as events from 'events';
import * as WebSocket from 'ws';
export interface CommServerConnectionPayload {
    event: 'connect';
    device: string;
}
export interface CommServer {
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'connect', listener: (data: CommServerConnectionPayload) => void): this;
}
export declare class CommServer extends events.EventEmitter {
    namespace: string;
    /**
     * Unique identifier of the publisher.
     */
    id: string;
    /**
     * Port of communication server.
     */
    port: number;
    protected server?: WebSocket.Server;
    constructor(namespace: string, 
    /**
     * Unique identifier of the publisher.
     */
    id: string, 
    /**
     * Port of communication server.
     */
    port: number);
    get clients(): Set<WebSocket>;
    start(): Promise<void>;
    private parseData;
    stop(): Promise<void>;
}
