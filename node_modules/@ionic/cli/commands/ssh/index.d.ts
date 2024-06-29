import { MetadataGroup } from '@ionic/cli-framework';
import { CommandMap, Namespace } from '../../lib/namespace';
export declare class SSHNamespace extends Namespace {
    getMetadata(): Promise<{
        name: string;
        summary: string;
        description: string;
        footnotes: {
            id: string;
            url: string;
        }[];
        groups: MetadataGroup[];
    }>;
    getCommands(): Promise<CommandMap>;
}
