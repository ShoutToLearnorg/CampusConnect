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
exports.LiveUpdatesNamespace = void 0;
const color_1 = require("../../lib/color");
const namespace_1 = require("../../lib/namespace");
class LiveUpdatesNamespace extends namespace_1.Namespace {
    async getMetadata() {
        return {
            name: 'live-update',
            summary: 'Ionic Live Updates functionality',
            description: `
These commands integrate with Ionic Cloud to configure the Live Updates plugin in your project and run remote builds.

Ionic Live Updates documentation:
- Overview: ${(0, color_1.strong)('https://ion.link/appflow-deploy-docs')}
`,
            groups: ["paid" /* MetadataGroup.PAID */],
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['add', async () => { const { AddCommand } = await Promise.resolve().then(() => __importStar(require('./add'))); return new AddCommand(this); }],
            ['configure', async () => { const { ConfigureCommand } = await Promise.resolve().then(() => __importStar(require('./configure'))); return new ConfigureCommand(this); }],
            ['manifest', async () => { const { LiveUpdatesManifestCommand } = await Promise.resolve().then(() => __importStar(require('./manifest'))); return new LiveUpdatesManifestCommand(this); }],
        ]);
    }
}
exports.LiveUpdatesNamespace = LiveUpdatesNamespace;
