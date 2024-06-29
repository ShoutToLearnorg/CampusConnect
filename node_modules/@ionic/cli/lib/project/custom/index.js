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
exports.CustomProject = void 0;
const __1 = require("../");
const color_1 = require("../../color");
const errors_1 = require("../../errors");
class CustomProject extends __1.Project {
    constructor() {
        super(...arguments);
        this.type = 'custom';
    }
    /**
     * We can't detect custom project types. We don't know what they look like!
     */
    async detected() {
        return false;
    }
    async requireBuildRunner() {
        const { CustomBuildRunner } = await Promise.resolve().then(() => __importStar(require('./build')));
        const deps = { ...this.e, project: this };
        return new CustomBuildRunner(deps);
    }
    async requireServeRunner() {
        const { CustomServeRunner } = await Promise.resolve().then(() => __importStar(require('./serve')));
        const deps = { ...this.e, project: this };
        return new CustomServeRunner(deps);
    }
    async requireGenerateRunner() {
        throw new errors_1.RunnerNotFoundException(`Cannot perform generate for custom projects.\n` +
            `Since you're using the ${(0, color_1.strong)('custom')} project type, this command won't work. The Ionic CLI doesn't know how to generate framework components for custom projects.`);
    }
}
exports.CustomProject = CustomProject;
