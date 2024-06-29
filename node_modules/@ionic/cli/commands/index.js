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
exports.IonicNamespace = void 0;
const namespace_1 = require("../lib/namespace");
class IonicNamespace extends namespace_1.Namespace {
    constructor({ env, project }) {
        super(undefined);
        this._env = env;
        this._project = project;
    }
    get project() {
        return this._project;
    }
    set project(p) {
        this._project = p;
    }
    get env() {
        return this._env;
    }
    set env(env) {
        this._env = env;
    }
    async getMetadata() {
        return {
            name: 'ionic',
            summary: '',
        };
    }
    async getNamespaces() {
        return new namespace_1.NamespaceMap([
            ['config', async () => { const { ConfigNamespace } = await Promise.resolve().then(() => __importStar(require('./config/index'))); return new ConfigNamespace(this); }],
            ['cordova', async () => { const { CordovaNamespace } = await Promise.resolve().then(() => __importStar(require('./cordova/index'))); return new CordovaNamespace(this); }],
            ['capacitor', async () => { const { CapacitorNamespace } = await Promise.resolve().then(() => __importStar(require('./capacitor/index'))); return new CapacitorNamespace(this); }],
            ['live-update', async () => { const { LiveUpdatesNamespace } = await Promise.resolve().then(() => __importStar(require('./live-update/index'))); return new LiveUpdatesNamespace(this); }],
            ['git', async () => { const { GitNamespace } = await Promise.resolve().then(() => __importStar(require('./git/index'))); return new GitNamespace(this); }],
            ['ssl', async () => { const { SSLNamespace } = await Promise.resolve().then(() => __importStar(require('./ssl/index'))); return new SSLNamespace(this); }],
            ['ssh', async () => { const { SSHNamespace } = await Promise.resolve().then(() => __importStar(require('./ssh/index'))); return new SSHNamespace(this); }],
            ['monitoring', async () => { const { MonitoringNamespace } = await Promise.resolve().then(() => __importStar(require('./monitoring/index'))); return new MonitoringNamespace(this); }],
            ['integrations', async () => { const { IntegrationsNamespace } = await Promise.resolve().then(() => __importStar(require('./integrations/index'))); return new IntegrationsNamespace(this); }],
            ['enterprise', async () => { const { EnterpriseNamespace } = await Promise.resolve().then(() => __importStar(require('./enterprise/index'))); return new EnterpriseNamespace(this); }],
            ['cap', 'capacitor'],
            ['cdv', 'cordova'],
            ['i', 'integrations'],
            ['integration', 'integrations'],
        ]);
    }
    async getCommands() {
        return new namespace_1.CommandMap([
            ['build', async () => { const { BuildCommand } = await Promise.resolve().then(() => __importStar(require('./build'))); return new BuildCommand(this); }],
            ['completion', async () => { const { CompletionCommand } = await Promise.resolve().then(() => __importStar(require('./completion'))); return new CompletionCommand(this); }],
            ['generate', async () => { const { GenerateCommand } = await Promise.resolve().then(() => __importStar(require('./generate'))); return new GenerateCommand(this); }],
            ['help', async () => { const { HelpCommand } = await Promise.resolve().then(() => __importStar(require('./help'))); return new HelpCommand(this); }],
            ['info', async () => { const { InfoCommand } = await Promise.resolve().then(() => __importStar(require('./info'))); return new InfoCommand(this); }],
            ['init', async () => { const { InitCommand } = await Promise.resolve().then(() => __importStar(require('./init'))); return new InitCommand(this); }],
            ['ionitron', async () => { const { IonitronCommand } = await Promise.resolve().then(() => __importStar(require('./ionitron'))); return new IonitronCommand(this); }],
            ['link', async () => { const { LinkCommand } = await Promise.resolve().then(() => __importStar(require('./link'))); return new LinkCommand(this); }],
            ['login', async () => { const { LoginCommand } = await Promise.resolve().then(() => __importStar(require('./login'))); return new LoginCommand(this); }],
            ['logout', async () => { const { LogoutCommand } = await Promise.resolve().then(() => __importStar(require('./logout'))); return new LogoutCommand(this); }],
            ['repair', async () => { const { RepairCommand } = await Promise.resolve().then(() => __importStar(require('./repair'))); return new RepairCommand(this); }],
            ['serve', async () => { const { ServeCommand } = await Promise.resolve().then(() => __importStar(require('./serve'))); return new ServeCommand(this); }],
            ['share', async () => { const { ShareCommand } = await Promise.resolve().then(() => __importStar(require('./share'))); return new ShareCommand(this); }],
            ['signup', async () => { const { SignupCommand } = await Promise.resolve().then(() => __importStar(require('./signup'))); return new SignupCommand(this); }],
            ['start', async () => { const { StartCommand } = await Promise.resolve().then(() => __importStar(require('./start'))); return new StartCommand(this); }],
            ['state', async () => { const { StateCommand } = await Promise.resolve().then(() => __importStar(require('./state'))); return new StateCommand(this); }],
            ['telemetry', async () => { const { TelemetryCommand } = await Promise.resolve().then(() => __importStar(require('./telemetry'))); return new TelemetryCommand(this); }],
            ['version', async () => { const { VersionCommand } = await Promise.resolve().then(() => __importStar(require('./version'))); return new VersionCommand(this); }],
            ['g', 'generate'],
            ['s', 'serve'],
        ]);
    }
}
exports.IonicNamespace = IonicNamespace;
