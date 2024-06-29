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
exports.SSHDeleteCommand = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const color_1 = require("../../lib/color");
const base_1 = require("./base");
class SSHDeleteCommand extends base_1.SSHBaseCommand {
    async getMetadata() {
        return {
            name: 'delete',
            type: 'global',
            summary: 'Delete an SSH public key from Ionic',
            inputs: [
                {
                    name: 'key-id',
                    summary: 'The ID of the public key to delete',
                    validators: [cli_framework_1.validators.required],
                },
            ],
            groups: ["deprecated" /* MetadataGroup.DEPRECATED */],
        };
    }
    async preRun(inputs, options) {
        const { SSHKeyClient } = await Promise.resolve().then(() => __importStar(require('../../lib/ssh')));
        if (!inputs[0]) {
            const user = this.env.session.getUser();
            const token = await this.env.session.getUserToken();
            const sshkeyClient = new SSHKeyClient({ client: this.env.client, user, token });
            const paginator = sshkeyClient.paginate();
            const [r] = paginator;
            const res = await r;
            if (res.data.length === 0) {
                this.env.log.warn(`No SSH keys found. Use ${(0, color_1.input)('ionic ssh add')} to add keys to Ionic.`);
            }
            inputs[0] = await this.env.prompt({
                type: 'list',
                name: 'id',
                message: 'Which SSH keys would you like to delete from Ionic?',
                choices: res.data.map(key => ({
                    name: `${key.fingerprint} ${key.name} ${key.annotation}`,
                    value: key.id,
                })),
            });
        }
    }
    async run(inputs, options) {
        const { SSHKeyClient } = await Promise.resolve().then(() => __importStar(require('../../lib/ssh')));
        const [id] = inputs;
        const user = this.env.session.getUser();
        const token = await this.env.session.getUserToken();
        const sshkeyClient = new SSHKeyClient({ client: this.env.client, user, token });
        await sshkeyClient.delete(id);
        this.env.log.ok(`Your public key (${(0, color_1.strong)(id)}) has been removed from Ionic.`);
    }
}
exports.SSHDeleteCommand = SSHDeleteCommand;
