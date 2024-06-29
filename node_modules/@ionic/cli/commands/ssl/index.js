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
exports.SSLNamespace = void 0;
const color_1 = require("../../lib/color");
const namespace_1 = require("../../lib/namespace");
class SSLNamespace extends namespace_1.Namespace {
    async getMetadata() {
        return {
            name: 'ssl',
            summary: 'Commands for managing SSL keys & certificates',
            groups: ["deprecated" /* MetadataGroup.DEPRECATED */],
            description: `
These commands make it easy to manage SSL certificates for using HTTPS with ${(0, color_1.input)('ionic serve')}.
      `,
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['generate', async () => { const { SSLGenerateCommand } = await Promise.resolve().then(() => __importStar(require('./generate'))); return new SSLGenerateCommand(this); }],
            ['g', 'generate'],
        ]);
    }
}
exports.SSLNamespace = SSLNamespace;
