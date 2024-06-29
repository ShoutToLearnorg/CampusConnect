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
exports.VueViteBuildCLI = exports.VueViteBuildRunner = void 0;
const build_1 = require("../../build");
class VueViteBuildRunner extends build_1.BuildRunner {
    constructor(e) {
        super();
        this.e = e;
    }
    async getCommandMetadata() {
        return {};
    }
    createOptionsFromCommandLine(inputs, options) {
        const baseOptions = super.createBaseOptionsFromCommandLine(inputs, options);
        return {
            ...baseOptions,
            type: 'vue',
        };
    }
    async buildProject(options) {
        const vueScripts = new VueViteBuildCLI(this.e);
        await vueScripts.build(options);
    }
}
exports.VueViteBuildRunner = VueViteBuildRunner;
class VueViteBuildCLI extends build_1.BuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'Vite CLI Service';
        this.pkg = 'vite';
        this.program = 'vite';
        this.prefix = 'vite';
        this.script = build_1.BUILD_SCRIPT;
    }
    async buildArgs(options) {
        const { pkgManagerArgs } = await Promise.resolve().then(() => __importStar(require('../../utils/npm')));
        if (this.resolvedProgram === this.program) {
            return ['build', ...(options['--'] || [])];
        }
        else {
            const [, ...pkgArgs] = await pkgManagerArgs(this.e.config.get('npmClient'), { command: 'run', script: this.script, scriptArgs: options['--'] });
            return pkgArgs;
        }
    }
    async buildEnvVars(options) {
        const env = {};
        return { ...await super.buildEnvVars(options), ...env };
    }
}
exports.VueViteBuildCLI = VueViteBuildCLI;
