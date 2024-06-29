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
exports.HelpCommand = void 0;
const guards_1 = require("../guards");
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
class HelpCommand extends command_1.Command {
    async getMetadata() {
        return {
            name: 'help',
            type: 'global',
            summary: 'Provides help for a certain command',
            exampleCommands: ['start'],
            inputs: [
                {
                    name: 'command',
                    summary: 'The command you desire help with',
                },
            ],
            options: [
                {
                    name: 'json',
                    summary: 'Print help in JSON format',
                    type: Boolean,
                },
            ],
            groups: ["hidden" /* MetadataGroup.HIDDEN */],
        };
    }
    async run(inputs, options) {
        const { CommandSchemaHelpFormatter, CommandStringHelpFormatter, NamespaceSchemaHelpFormatter, NamespaceStringHelpFormatter } = await Promise.resolve().then(() => __importStar(require('../lib/help')));
        const location = await this.namespace.locate(inputs);
        if ((0, guards_1.isCommand)(location.obj)) {
            const formatterOptions = { location, command: location.obj };
            const formatter = options['json'] ? new CommandSchemaHelpFormatter(formatterOptions) : new CommandStringHelpFormatter(formatterOptions);
            this.env.log.rawmsg(await formatter.format());
        }
        else {
            if (location.args.length > 0) {
                this.env.log.error(`Unable to find command: ${(0, color_1.input)(inputs.join(' '))}` +
                    (this.project ? '' : '\nYou may need to be in an Ionic project directory.'));
            }
            const now = new Date();
            const version = this.env.ctx.version;
            const suffix = now.getMonth() === 9 && now.getDate() === 31 ? ' 🎃' : '';
            const formatterOptions = {
                inProject: this.project ? true : false,
                version: version + suffix,
                location,
                namespace: location.obj,
            };
            const formatter = options['json'] ? new NamespaceSchemaHelpFormatter(formatterOptions) : new NamespaceStringHelpFormatter(formatterOptions);
            this.env.log.rawmsg(await formatter.format());
        }
    }
}
exports.HelpCommand = HelpCommand;
