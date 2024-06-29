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
exports.SSHNamespace = void 0;
const color_1 = require("../../lib/color");
const namespace_1 = require("../../lib/namespace");
class SSHNamespace extends namespace_1.Namespace {
    async getMetadata() {
        const dashUrl = this.env.config.getDashUrl();
        return {
            name: 'ssh',
            summary: 'Commands for configuring SSH keys',
            description: `
These commands help automate your SSH configuration for Ionic. As an alternative, SSH configuration can be done entirely manually by visiting your Personal Settings[^dashboard-settings-ssh-keys].

To begin, run ${(0, color_1.input)('ionic ssh setup')}, which lets you use existing keys or generate new ones just for Ionic.

Deprecated. Developers should configure SSH by visiting their Personal Settings at https://dashboard.ionicframework.com/settings/ssh-keys.
      `,
            footnotes: [
                {
                    id: 'dashboard-settings-ssh-keys',
                    url: `${dashUrl}/settings/ssh-keys`,
                },
            ],
            groups: ["deprecated" /* MetadataGroup.DEPRECATED */],
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['generate', async () => { const { SSHGenerateCommand } = await Promise.resolve().then(() => __importStar(require('./generate'))); return new SSHGenerateCommand(this); }],
            ['use', async () => { const { SSHUseCommand } = await Promise.resolve().then(() => __importStar(require('./use'))); return new SSHUseCommand(this); }],
            ['add', async () => { const { SSHAddCommand } = await Promise.resolve().then(() => __importStar(require('./add'))); return new SSHAddCommand(this); }],
            ['delete', async () => { const { SSHDeleteCommand } = await Promise.resolve().then(() => __importStar(require('./delete'))); return new SSHDeleteCommand(this); }],
            ['list', async () => { const { SSHListCommand } = await Promise.resolve().then(() => __importStar(require('./list'))); return new SSHListCommand(this); }],
            ['setup', async () => { const { SSHSetupCommand } = await Promise.resolve().then(() => __importStar(require('./setup'))); return new SSHSetupCommand(this); }],
            ['ls', 'list'],
            ['remove', 'delete'],
            ['rm', 'delete'],
            ['g', 'generate'],
        ]);
    }
}
exports.SSHNamespace = SSHNamespace;
