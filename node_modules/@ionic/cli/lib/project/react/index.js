"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactProject = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const debug_1 = require("debug");
const lodash = tslib_1.__importStar(require("lodash"));
const path = tslib_1.__importStar(require("path"));
const __1 = require("../");
const errors_1 = require("../../errors");
const debug = (0, debug_1.debug)('ionic:lib:project:React');
class ReactProject extends __1.Project {
    constructor() {
        super(...arguments);
        this.type = 'react';
    }
    async getInfo() {
        const [[ionicReactPkg, ionicReactPkgPath],] = await Promise.all([
            this.getPackageJson('@ionic/react'),
        ]);
        return [
            ...(await super.getInfo()),
            {
                group: 'ionic',
                name: 'Ionic Framework',
                key: 'framework',
                value: ionicReactPkg ? `@ionic/react ${ionicReactPkg.version}` : 'not installed',
                path: ionicReactPkgPath,
            },
        ];
    }
    /**
     * We can't detect React project types. We don't know what they look like!
     */
    async detected() {
        try {
            const pkg = await this.requirePackageJson();
            const deps = lodash.assign({}, pkg.dependencies, pkg.devDependencies);
            if (typeof deps['@ionic/React'] === 'string') {
                debug(`${chalk_1.default.bold('@ionic/React')} detected in ${chalk_1.default.bold('package.json')}`);
                return true;
            }
        }
        catch (e) {
            // ignore
        }
        return false;
    }
    async getDefaultDistDir() {
        return 'build';
    }
    async requireBuildRunner() {
        const { ReactBuildRunner } = await Promise.resolve().then(() => tslib_1.__importStar(require('./build')));
        const deps = { ...this.e, project: this };
        return new ReactBuildRunner(deps);
    }
    async requireServeRunner() {
        const { ReactServeRunner } = await Promise.resolve().then(() => tslib_1.__importStar(require('./serve')));
        const deps = { ...this.e, project: this };
        return new ReactServeRunner(deps);
    }
    async requireGenerateRunner() {
        throw new errors_1.RunnerNotFoundException(`Cannot perform generate for React projects.\n` +
            `Since you're using the ${chalk_1.default.bold('React')} project type, this command won't work. The Ionic CLI doesn't know how to generate framework components for React projects.`);
    }
    setPrimaryTheme(themeColor) {
        const themePath = path.join(this.directory, 'src', 'theme', 'variables.css');
        return this.writeThemeColor(themePath, themeColor);
    }
}
exports.ReactProject = ReactProject;
