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
exports.ConfigNamespace = void 0;
const utils_terminal_1 = require("@ionic/utils-terminal");
const constants_1 = require("../../constants");
const color_1 = require("../../lib/color");
const namespace_1 = require("../../lib/namespace");
class ConfigNamespace extends namespace_1.Namespace {
    async getMetadata() {
        const projectFile = this.project ? (0, utils_terminal_1.prettyPath)(this.project.filePath) : constants_1.PROJECT_FILE;
        return {
            name: 'config',
            summary: 'Manage CLI and project config values',
            description: `
These commands are used to programmatically read, write, and delete CLI and project config values.

By default, these commands use your project's ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(projectFile))} file.

To use these commands for the global CLI config file (${(0, color_1.strong)('~/.ionic/config.json')}), use the ${(0, color_1.input)('--global')} flag.
      `,
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['get', async () => { const { ConfigGetCommand } = await Promise.resolve().then(() => __importStar(require('./get'))); return new ConfigGetCommand(this); }],
            ['set', async () => { const { ConfigSetCommand } = await Promise.resolve().then(() => __importStar(require('./set'))); return new ConfigSetCommand(this); }],
            ['unset', async () => { const { ConfigUnsetCommand } = await Promise.resolve().then(() => __importStar(require('./unset'))); return new ConfigUnsetCommand(this); }],
            ['delete', 'unset'],
            ['del', 'unset'],
        ]);
    }
}
exports.ConfigNamespace = ConfigNamespace;
