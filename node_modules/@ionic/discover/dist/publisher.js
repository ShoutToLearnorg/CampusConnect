"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const dgram = require("dgram");
const events = require("events");
const netmask_1 = require("netmask");
const os = require("os");
const debug = Debug('ionic:discover:publisher');
const PREFIX = 'ION_DP';
const PORT = 41234;
class Publisher extends events.EventEmitter {
    constructor(namespace, name, port, commPort) {
        super();
        this.namespace = namespace;
        this.name = name;
        this.port = port;
        this.commPort = commPort;
        this.path = '/';
        this.running = false;
        this.interval = 2000;
        if (name.indexOf(':') >= 0) {
            throw new Error('name should not contain ":"');
        }
        this.id = Math.random().toString(10).substring(2, 8);
    }
    start() {
        return new Promise((resolve, reject) => {
            if (this.running) {
                return resolve();
            }
            this.running = true;
            if (!this.interfaces) {
                this.interfaces = this.getInterfaces();
            }
            const client = this.client = dgram.createSocket('udp4');
            client.on('error', err => {
                this.emit('error', err);
            });
            client.on('listening', () => {
                client.setBroadcast(true);
                this.timer = setInterval(() => this.sayHello(), this.interval);
                this.sayHello();
                debug('Publisher starting');
                resolve();
            });
            client.bind();
        });
    }
    stop() {
        if (!this.running) {
            return;
        }
        this.running = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
        if (this.client) {
            this.client.close();
            this.client = undefined;
        }
    }
    buildMessage(ip) {
        return {
            t: Date.now(),
            id: this.id,
            nspace: this.namespace,
            name: this.name,
            host: os.hostname(),
            ip,
            port: this.port,
            commPort: this.commPort,
            path: this.path,
        };
    }
    getInterfaces() {
        return prepareInterfaces(os.networkInterfaces());
    }
    sayHello() {
        if (!this.interfaces) {
            throw new Error('No network interfaces set--was the service started?');
        }
        if (!this.client) {
            throw new Error('Client not initialized--was the service started?');
        }
        try {
            for (const iface of this.interfaces) {
                const message = this.buildMessage(iface.address);
                const serialized = PREFIX + JSON.stringify(message);
                const buf = Buffer.from(serialized);
                debug(`Broadcasting %O to ${iface.broadcast}`, serialized);
                this.client.send(buf, 0, buf.length, PORT, iface.broadcast, err => {
                    if (err) {
                        this.emit('error', err);
                    }
                });
            }
        }
        catch (e) {
            this.emit('error', e);
        }
    }
}
exports.Publisher = Publisher;
function prepareInterfaces(interfaces) {
    const set = new Set();
    return Object.keys(interfaces)
        .map(key => interfaces[key])
        .reduce((prev, current) => prev.concat(current))
        .filter(iface => iface.family === 'IPv4')
        .map(iface => {
        return {
            address: iface.address,
            broadcast: computeBroadcastAddress(iface.address, iface.netmask),
        };
    })
        .filter(iface => {
        if (!set.has(iface.broadcast)) {
            set.add(iface.broadcast);
            return true;
        }
        return false;
    });
}
exports.prepareInterfaces = prepareInterfaces;
function newSilentPublisher(namespace, name, port) {
    name = `${name}@${port}`;
    const service = new Publisher(namespace, name, port);
    service.on('error', () => {
        // do not log
    });
    service.start().catch(() => {
        // do not log
    });
    return service;
}
exports.newSilentPublisher = newSilentPublisher;
function computeBroadcastAddress(address, netmask) {
    const ip = address + '/' + netmask;
    const block = new netmask_1.Netmask(ip);
    return block.broadcast;
}
exports.computeBroadcastAddress = computeBroadcastAddress;
