"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueViteProject = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const debug_1 = require("debug");
const lodash = tslib_1.__importStar(require("lodash"));
const path = tslib_1.__importStar(require("path"));
const __1 = require("../");
const errors_1 = require("../../errors");
const debug = (0, debug_1.debug)('ionic:lib:project:vue');
class VueViteProject extends __1.Project {
    constructor() {
        super(...arguments);
        this.type = 'vue';
    }
    async getInfo() {
        const [[ionicVuePkg, ionicVuePkgPath],] = await Promise.all([
            this.getPackageJson('@ionic/vue'),
        ]);
        return [
            ...(await super.getInfo()),
            {
                group: 'ionic',
                name: 'Ionic Framework',
                key: 'framework',
                value: ionicVuePkg ? `@ionic/vue ${ionicVuePkg.version}` : 'not installed',
                path: ionicVuePkgPath,
            },
        ];
    }
    /**
     * We can't detect Vue project types. We don't know what they look like!
     */
    async detected() {
        try {
            const pkg = await this.requirePackageJson();
            const deps = lodash.assign({}, pkg.dependencies, pkg.devDependencies);
            if (typeof deps['@ionic/vue'] === 'string') {
                debug(`${chalk_1.default.bold('@ionic/vue')} detected in ${chalk_1.default.bold('package.json')}`);
                return true;
            }
        }
        catch (e) {
            // ignore
        }
        return false;
    }
    async getDefaultDistDir() {
        return 'dist';
    }
    async requireBuildRunner() {
        const { VueViteBuildRunner } = await Promise.resolve().then(() => tslib_1.__importStar(require('./build')));
        const deps = { ...this.e, project: this };
        return new VueViteBuildRunner(deps);
    }
    async requireServeRunner() {
        const { VueServeRunner } = await Promise.resolve().then(() => tslib_1.__importStar(require('./serve')));
        const deps = { ...this.e, project: this };
        return new VueServeRunner(deps);
    }
    async requireGenerateRunner() {
        throw new errors_1.RunnerNotFoundException(`Cannot perform generate for Vue projects.\n` +
            `Since you're using the ${chalk_1.default.bold('Vue')} project type, this command won't work. The Ionic CLI doesn't know how to generate framework components for Vue projects.`);
    }
    setPrimaryTheme(themeColor) {
        const themePath = path.join(this.directory, 'src', 'theme', 'variables.css');
        return this.writeThemeColor(themePath, themeColor);
    }
}
exports.VueViteProject = VueViteProject;
