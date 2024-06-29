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
exports.CordovaNamespace = void 0;
const color_1 = require("../../lib/color");
const namespace_1 = require("../../lib/namespace");
class CordovaNamespace extends namespace_1.Namespace {
    async getMetadata() {
        return {
            name: 'cordova',
            summary: 'Cordova functionality',
            description: `
These commands integrate with Apache Cordova, which brings native functionality to your app.

Cordova Reference documentation:
- Overview: ${(0, color_1.strong)('https://cordova.apache.org/docs/en/latest/guide/overview/index.html')}
- CLI documentation: ${(0, color_1.strong)('https://cordova.apache.org/docs/en/latest/reference/cordova-cli/')}
      `,
        };
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['build', async () => { const { BuildCommand } = await Promise.resolve().then(() => __importStar(require('./build'))); return new BuildCommand(this); }],
            ['compile', async () => { const { CompileCommand } = await Promise.resolve().then(() => __importStar(require('./compile'))); return new CompileCommand(this); }],
            ['emulate', async () => { const { EmulateCommand } = await Promise.resolve().then(() => __importStar(require('./emulate'))); return new EmulateCommand(this); }],
            ['platform', async () => { const { PlatformCommand } = await Promise.resolve().then(() => __importStar(require('./platform'))); return new PlatformCommand(this); }],
            ['plugin', async () => { const { PluginCommand } = await Promise.resolve().then(() => __importStar(require('./plugin'))); return new PluginCommand(this); }],
            ['prepare', async () => { const { PrepareCommand } = await Promise.resolve().then(() => __importStar(require('./prepare'))); return new PrepareCommand(this); }],
            ['resources', async () => { const { ResourcesCommand } = await Promise.resolve().then(() => __importStar(require('./resources'))); return new ResourcesCommand(this); }],
            ['run', async () => { const { RunCommand } = await Promise.resolve().then(() => __importStar(require('./run'))); return new RunCommand(this); }],
            ['requirements', async () => { const { RequirementsCommand } = await Promise.resolve().then(() => __importStar(require('./requirements'))); return new RequirementsCommand(this); }],
            ['platforms', 'platform'],
            ['plugins', 'plugin'],
            ['res', 'resources'],
        ]);
    }
}
exports.CordovaNamespace = CordovaNamespace;
