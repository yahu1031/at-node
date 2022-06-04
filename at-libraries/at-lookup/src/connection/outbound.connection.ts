import { AtError } from "@sign/at-commons";
import { Socket } from "node:net";
import { AtConnectionMetaData } from "./at.connection";
import { ABaseConnection } from "./base.connection";

export abstract class AOutboundConnection extends ABaseConnection {

    constructor(socket: Socket) {
        super(socket);
    }

    abstract setIdleTime(idleTimeMillis?: number): void;
}

/**
 * Metadata information for {@link AOutboundConnection}
 */
export class OutboundConnectionMetadata extends AtConnectionMetaData { }


export class OutboundConnection extends AOutboundConnection {
    // default timeout 10 minutes
    private outbound_idle_time = 600000;

    constructor(socket: Socket) {
        super(socket);
        this.metaData = new OutboundConnectionMetadata();
        this.metaData.created = new Date(new Date().toUTCString());
    }

    private _getIdleTimeMillis(): number {
        var lastAccessedTime = this.getMetaData().lastAccessed;
        lastAccessedTime = lastAccessedTime ?? this.getMetaData().created;
        var currentTime = new Date(new Date().toUTCString());
        return currentTime.getDate() - lastAccessedTime!.getDate();
    }

    private _isIdle(): boolean {
        return this._getIdleTimeMillis() > this.outbound_idle_time;
    }

    setIdleTime(idleTimeMillis?: number): void {
        if (idleTimeMillis === undefined || idleTimeMillis === null) {
            throw new AtError('idleTimeMillis is required');
        };
        this.outbound_idle_time = idleTimeMillis!;
    }

    isInValid(): boolean {
        return this._isIdle() || this.getMetaData()!.isClosed || this.getMetaData()!.isStale;
    }
}