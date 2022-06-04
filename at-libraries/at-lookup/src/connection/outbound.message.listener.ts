import { AtTimeoutError, BufferOverFlowError, ByteBuffer } from "@sign/at-commons";
import { AtLogger } from '@sign/at-utils';
import { TextDecoder } from "text-encoding";
import { AtLookUpError } from "../utils/error";
import { Queue } from "../utils/queue.util";
import { OutboundConnection } from "./outbound.connection";

export class OutboundMessageListener {
    _logger = new AtLogger('OutboundMessageListener');

    _buffer = new ByteBuffer({ capacity: 10240000 })

    queue = new Queue<string>();

    _connection: OutboundConnection;

    callback?: (data: string) => void;

    constructor(connection: any) {
        this._connection = connection;
    }

    /**
     * Listens to the underlying connection's socket if the connection is created.
     * throws `AtConnectException` if the connection is not yet created.
     */
    listen(): void {
        this._connection.getSocket().on('data', (data: Uint8Array) => this._messageHandler(data),
        ).on('error', async (error: Error) => {
            this._logger.error(error);
            await this._errorHandler();
        }).on('close', async () => {
            this._logger.info('connection closed');
            this._finishedHandler();
        });
    }

    /**
     * Handles messages on the inbound client's connection and calls the verb executor
     * Closes the inbound connection in case of any error.
     * Throw a {@link BufferOverFlowError } if buffer is unable to hold incoming data
     */
    async _messageHandler(data: Uint8Array): Promise<void> {
        var result: string;
        if (!this._buffer.isOverFlow(data)) {
            // skip @ prompt
            if (data.length == 1 && data[0] == 64) {
                return;
            }
            // ignore prompt(@ or @<atSign>@) after '\n'
            // If data contains 10(utf8 character for '\n'), trim the string after the '\n'
            if (data.includes(10)) {
                data = data.subarray(0, data.lastIndexOf(10) + 1);
            }
            this._buffer.append(data);
        } else {
            this._buffer.clear();
            throw new BufferOverFlowError('Buffer overflow on outbound connection result');
        }
        if (this._buffer.isEnd()) {
            result = new TextDecoder().decode(this._buffer.getData());
            result = result.trim();
            this._buffer.clear();
            this.queue.enqueue(result);
        }
    }

    /**
     * Reads the response sent by remote socket from the queue.
     * If there is no message in queue after [maxWaitMilliSeconds], return null. Defaults to 3 seconds.
     */
    async read(maxWaitMilliSec: number = 10000): Promise<string> {
        return await this._read(maxWaitMilliSec);
    }

    _isValidResponse(response: string): boolean {
        return response.startsWith('data:') || response.startsWith('stream') || response.startsWith('error:') || (response.startsWith('@') && response.endsWith('@'));
    }

    private async _read(maxWaitMilliSec: number = 10000, retryCount: number = 1): Promise<string> {
        let result: string | undefined;
        var maxIterations = maxWaitMilliSec / 10;
        if (retryCount == maxIterations) {
            this._buffer.clear();
            throw new AtTimeoutError(`No response after ${maxWaitMilliSec} ms from the remote secondary server`);
        }
        var queueLength = this.queue.size();
        if (queueLength > 0) {
            result = this.queue.dequeueFirst();
            // result from another secondary is either data or a @<atSign>@ denoting complete
            // of the handshake
            if (this._isValidResponse(result)) {
                return result;
            }
            this._buffer.clear();
            throw new AtLookUpError(`Unexpected response found: ${result}`);
        }
        return await new Promise(resolve => setTimeout(resolve, 10))
            .then(() => this._read(maxWaitMilliSec, retryCount + 1));
    }

    /**
     * Logs the error and closes the {@link RemoteSecondary}
     */
    private async _errorHandler(): Promise<void> {
        await this._closeConnection();
    }

    /** 
     * Closes the {@link OutboundConnection}
     */
    private async _finishedHandler(): Promise<void> {
        this._logger.finer('outbound finish handler called');
        await this._closeConnection();
    }

    private async _closeConnection(): Promise<void> {
        if (!this._connection.isInValid()) {
            await this._connection.close();
        }
    }

}