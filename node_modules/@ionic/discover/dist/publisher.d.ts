/// <reference types="node" />
import * as dgram from 'dgram';
import * as events from 'events';
import * as os from 'os';
export interface Interface {
    address: string;
    broadcast: string;
}
export interface PublisherMessage {
    t: number;
    id: string;
    nspace: string;
    name: string;
    host: string;
    ip: string;
    port: number;
    commPort?: number;
    path: string;
}
export interface IPublisherEventEmitter {
    on(event: 'error', listener: (err: Error) => void): this;
}
export declare class Publisher extends events.EventEmitter implements IPublisherEventEmitter {
    namespace: string;
    name: string;
    port: number;
    commPort?: number | undefined;
    readonly id: string;
    readonly path = "/";
    running: boolean;
    interfaces?: Interface[];
    protected timer?: NodeJS.Timer;
    protected interval: number;
    protected client?: dgram.Socket;
    constructor(namespace: string, name: string, port: number, commPort?: number | undefined);
    start(): Promise<void>;
    stop(): void;
    protected buildMessage(ip: string): PublisherMessage;
    protected getInterfaces(): Interface[];
    protected sayHello(): void;
}
export declare function prepareInterfaces(interfaces: {
    [index: string]: os.NetworkInterfaceInfo[];
}): Interface[];
export declare function newSilentPublisher(namespace: string, name: string, port: number): Publisher;
export declare function computeBroadcastAddress(address: string, netmask: string): string;
