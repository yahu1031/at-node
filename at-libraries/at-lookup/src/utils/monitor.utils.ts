import { UnAuthenticatedError } from "@sign/at-commons";
import { AtLogger } from "@sign/at-utils";
import { Socket } from "node:net";
import { CacheableSecondaryAddressFinder } from "../cache/cacheable-secondary-address-finder";
import { OutboundConnection } from "../connection/outbound.connection";
import { signChallenge } from "./helper.utils";
import { Queue } from "./queue.util";

export class MonitorClient{

    private _logger = new AtLogger('MonitorClient');
    
    private _monitorVerbResponseQueue = new Queue<string>();

    response?: string;

    private _privateKey!: string;

    constructor(privateKey: string) {
        this._privateKey = privateKey;
    }

    /**
     * Executes monitor command
     * @param command 
     * @param atSign 
     * @param rootDoamin 
     * @param port
     * @param notificationCallback
     * @param [options] 
     * @returns monitor command 
     */
    public async executeMonitorCommand(command: string, atSign: string, rootDoamin: string, port: number, notificationCallback: Function, options?: { auth?: boolean, restartCallback?: Function }): Promise<OutboundConnection> {
        var _monitorConnection = await this._createNewConnection(atSign, rootDoamin, port);
        var socket = _monitorConnection.getSocket();
        socket.on('data', (data) => {
            this.response = data.toString('utf-8');
            if (this.response.startsWith('notification')) {
                notificationCallback(this.response);
            } else {
                this._monitorVerbResponseQueue.enqueue(this.response);
            }
        }).on('error', (error) => {
            this._logger.error(`Error in monitor connection: ${error}`);
            this._errorHandler(error, _monitorConnection);
        }).on('close', () => {
            this._logger.info(`Monitor connection closed`);
            this._finishHandler(_monitorConnection);
            options?.restartCallback!(command, notificationCallback, this._privateKey);
        });
        await this._authenticateConnection(atSign, _monitorConnection);
        _monitorConnection.write(command);
        return _monitorConnection;
    }
    
    /**
     * Creates new connection
     * @param atSign 
     * @param rootDoamin 
     * @param port 
     * @returns new connection 
     */
    private async _createNewConnection(atSign: string, rootDoamin: string, port: number): Promise<OutboundConnection> {
        var secondaryUrl = await new CacheableSecondaryAddressFinder(rootDoamin, port).findSecondaryAddress(atSign);
        var secondaryInfo = this._getSecondaryInfo(secondaryUrl);
        var _host = secondaryInfo[0];
        var _port = secondaryInfo[1];
        var socket = new Socket().connect(parseInt(_port), _host);
        return new OutboundConnection(socket);
    }

    /**
     * Authenticates connection
     * @param atSign 
     * @param connection 
     * @returns connection 
     */
    private async _authenticateConnection(atSign: string, connection: OutboundConnection): Promise<OutboundConnection> {
        connection.write(`from:${atSign}\n`);
        var response = await this._getQueueResponse();
        response = response.trim().replaceAll('data:', '');
        this._logger.finer(`From response : ${response}`);
        var signature = signChallenge(this._privateKey, response);
        this._logger.finer(`Sending PKAM : ${signature}`);
        connection.write(`pkam:${signature}\n`);
        response = await this._getQueueResponse();
        this._logger.finer(`From response : ${response}`);
        if (response.includes('success')) {
            this._logger.finer(`Authentication success`);
            return connection;
        } else {
            throw new UnAuthenticatedError(`Authentication failed`);
        }
     }
    
    /**
     * Gets monitor verb queue response
     * @returns queue response 
     */
    private async _getQueueResponse(): Promise<string> { 
        var maxWait = 5000;
        var result = '';
        var loopCount = Math.round(maxWait / 50);
        for (var i = 0; i < loopCount; i++) {
            await new Promise(resolve => setTimeout(resolve, 90));
            var queLen = this._monitorVerbResponseQueue.size();
            if (queLen > 0) {
                result = this._monitorVerbResponseQueue.dequeueFirst();
                if(result.startsWith('data:')) {
                    var index = result.indexOf(':');
                    result = result.substring(index + 1, result.length - 2);
                    break;
                }
            }
        }
        return result;
    }
    
    /**
     * Gets secondary info
     * @param [url] 
     * @returns secondary info 
     */
    private _getSecondaryInfo(url?: string): string[] {
        var result: string[] = [];
        if (url && url.includes(':')) {
            var arr = url.split(':');
            result.push(arr[0]);
            result.push(arr[1]);
        }
        return result;
     }

    /**
     * Logs the error message and closes the connection
     * @param error 
     * @param connection 
     */
    private async _errorHandler(error: Error, connection: OutboundConnection): Promise<void> {
        this._logger.error(error.message);
        await this._closeConnection(connection);
     }
    
    private async _finishHandler(connection: OutboundConnection): Promise<void> { 
        await this._closeConnection(connection);
    }
    
    private async _closeConnection(connection: OutboundConnection): Promise<void> {
        if(!connection.isInValid()) {
            await connection.close();
        }
     }
}