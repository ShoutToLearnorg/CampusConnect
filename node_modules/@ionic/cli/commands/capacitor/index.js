"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapacitorNamespace = void 0;
const color_1 = require("../../lib/color");
const namespace_1 = require("../../lib/namespace");
class CapacitorNamespace extends namespace_1.Namespace {
    async getMetadata() {
        return {
            name: 'capacitor',
            summary: 'Capacitor functionality',
            description: `
These commands integrate with Capacitor, Ionic's new native layer project which provides an alternative to Cordova for native functionality in your app.

Learn more about Capacitor:
- Main documentation: ${(0, color_1.strong)('https://ion.link/capacitor')}
      `,
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['add', async () => { const { AddCommand } = await Promise.resolve().then(() => __importStar(require('./add'))); return new AddCommand(this); }],
            ['build', async () => { const { BuildCommand } = await Promise.resolve().then(() => __importStar(require('./build'))); return new BuildCommand(this); }],
            ['copy', async () => { const { CopyCommand } = await Promise.resolve().then(() => __importStar(require('./copy'))); return new CopyCommand(this); }],
            ['open', async () => { const { OpenCommand } = await Promise.resolve().then(() => __importStar(require('./open'))); return new OpenCommand(this); }],
            ['run', async () => { const { RunCommand } = await Promise.resolve().then(() => __importStar(require('./run'))); return new RunCommand(this); }],
            ['sync', async () => { const { SyncCommand } = await Promise.resolve().then(() => __importStar(require('./sync'))); return new SyncCommand(this); }],
            ['update', async () => { const { UpdateCommand } = await Promise.resolve().then(() => __importStar(require('./update'))); return new UpdateCommand(this); }],
        ]);
    }
}
exports.CapacitorNamespace = CapacitorNamespace;
