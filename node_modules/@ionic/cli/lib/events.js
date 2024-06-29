"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = void 0;
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('ionic:lib:events');
function emit(event, data) {
    if (!process.send) {
        debug('No process.send, not emitting event %s', event);
        return false;
    }
    const msg = { type: 'event', event, data };
    process.send(msg);
    debug('Sent event %s as IPC message to parent process', event);
    return true;
}
exports.emit = emit;
