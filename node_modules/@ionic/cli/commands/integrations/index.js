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
exports.IntegrationsNamespace = void 0;
const namespace_1 = require("../../lib/namespace");
class IntegrationsNamespace extends namespace_1.Namespace {
    async getMetadata() {
        return {
            name: 'integrations',
            summary: 'Manage various integrations in your app',
            description: 'Integrations, such as Cordova, can be enabled or disabled in your app with these commands.',
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['enable', async () => { const { IntegrationsEnableCommand } = await Promise.resolve().then(() => __importStar(require('./enable'))); return new IntegrationsEnableCommand(this); }],
            ['disable', async () => { const { IntegrationsDisableCommand } = await Promise.resolve().then(() => __importStar(require('./disable'))); return new IntegrationsDisableCommand(this); }],
            ['list', async () => { const { IntegrationsListCommand } = await Promise.resolve().then(() => __importStar(require('./list'))); return new IntegrationsListCommand(this); }],
            ['ls', 'list'],
            ['en', 'enable'],
            ['add', 'enable'],
            ['dis', 'disable'],
            ['delete', 'disable'],
            ['del', 'disable'],
            ['remove', 'disable'],
            ['rm', 'disable'],
        ]);
    }
}
exports.IntegrationsNamespace = IntegrationsNamespace;
