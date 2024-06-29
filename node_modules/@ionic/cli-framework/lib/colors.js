"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_COLORS = exports.DEFAULT_COLORS = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const lodash = tslib_1.__importStar(require("lodash"));
exports.DEFAULT_COLORS = Object.freeze({
    strong: chalk_1.default.bold,
    weak: chalk_1.default.dim,
    input: chalk_1.default.cyan,
    success: chalk_1.default.green,
    failure: chalk_1.default.red,
    ancillary: chalk_1.default.cyan,
    log: Object.freeze({
        DEBUG: chalk_1.default.magenta,
        INFO: chalk_1.default.white,
        WARN: chalk_1.default.yellow,
        ERROR: chalk_1.default.red,
    }),
    help: Object.freeze({
        title: chalk_1.default.bold,
        group: Object.freeze({
            ["deprecated" /* MetadataGroup.DEPRECATED */]: chalk_1.default.yellow,
            ["beta" /* MetadataGroup.BETA */]: chalk_1.default.magenta,
            ["experimental" /* MetadataGroup.EXPERIMENTAL */]: chalk_1.default.red,
            ["paid" /* MetadataGroup.PAID */]: chalk_1.default.green,
        }),
    }),
});
exports.NO_COLORS = Object.freeze({
    strong: lodash.identity,
    weak: lodash.identity,
    input: lodash.identity,
    success: lodash.identity,
    failure: lodash.identity,
    ancillary: lodash.identity,
    log: Object.freeze({
        DEBUG: lodash.identity,
        INFO: lodash.identity,
        WARN: lodash.identity,
        ERROR: lodash.identity,
    }),
    help: Object.freeze({
        title: lodash.identity,
        group: Object.freeze({
            ["deprecated" /* MetadataGroup.DEPRECATED */]: lodash.identity,
            ["beta" /* MetadataGroup.BETA */]: lodash.identity,
            ["experimental" /* MetadataGroup.EXPERIMENTAL */]: lodash.identity,
            ["paid" /* MetadataGroup.PAID */]: lodash.identity,
        }),
    }),
});
