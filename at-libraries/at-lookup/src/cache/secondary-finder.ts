import { AtConnectionError, AtTimeoutError, TextDecoder } from "@sign/at-commons";
import { AtLogger } from "@sign/at-utils";
import { Socket } from "node:net";
import './../utils/ext.util';

export abstract class SecondaryAddressFinder {
    abstract findSecondaryAddress(atSign: string): Promise<string>;
}

export class SecondaryAddress {
    host!: string;
    port!: number;
    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    toString(): string {
        return `${this.host}:${this.port}`;
    }
}

export class SecondaryUrlFinder {
    private _rootDomain!: string;
    private _rootPort!: number;
    private _logger = new AtLogger('SecondaryUrlFinder');
    constructor(rootDomain: string, rootPort: number) {
        this._rootDomain = rootDomain;
        this._rootPort = rootPort;
    };

    async findSecondaryUrl(atSign: string): Promise<string | null> {
        return await this._findSecondary(atSign);
    }

    async _findSecondary(atsign: string): Promise<string | null> {
        var response: string | null;
        var socket: Socket = new Socket();
        try {
            this._logger.finer(`AtLookup.findSecondary received atsign: ${atsign}`);
            if (atsign.startsWith('@')) atsign = atsign.replaceFirst('@', '');
            var answer = '';
            var secondary: string | null;
            var ans = false;
            var prompt = false;
            var once = true;
            // ignore: omit_local_variable_types
            socket.connect(this._rootPort, this._rootDomain);
            // listen to the received data event stream
            socket.on('listening', async (event: any) => {
                answer = new TextDecoder().decode(event);
                if (answer.endsWith('@') && prompt == false && once == true) {
                    prompt = true;
                    socket.write(atsign + '\n');
                    socket.destroy();
                    once = false;
                }

                if (answer.includes(':')) {
                    answer = answer.replaceFirst('\r\n@', '');
                    answer = answer.replaceFirst('@', '');
                    answer = answer.replaceAll('@', '');
                    secondary = answer.trim();
                    ans = true;
                } else if (answer.startsWith('null')) {
                    secondary = null;
                    ans = true;
                }
            });
            // wait 30 seconds
            for (var i = 0; i < 6000; i++) {
                // delay for 10 milliseconds
                await new Promise(resolve => setTimeout(resolve, 5));
                if (ans) {
                    response = secondary!;
                    socket.write('@exit\n');
                    socket.destroy();
                    this._logger.finer(
                        'AtLookup.findSecondary got answer: $secondary and closing connection');
                    return response;
                }
            }
            // .. and close the socket
            socket.destroy();
            throw new AtTimeoutError('AtLookup.findSecondary timed out');
        } catch (e: any) {
            this._logger.error('AtLookup.findSecondary connection to ' +
                this._rootDomain +
                ' exception: ' +
                e.toString());
            if (socket != null) {
                socket.destroy();
            }
            throw new AtConnectionError('AtLookup.findSecondary connection to ' +
                this._rootDomain +
                ' exception: ' +
                e.toString());
        }
    }
}
