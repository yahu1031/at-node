import { AAtBuffer } from ".";
import { BufferOverFlowError } from "../errors";
import { TextEncoder } from "text-encoding";

export class ByteBuffer extends AAtBuffer<Uint8Array> {
    private _bytesBuilder: Uint8Array;

    constructor({ terminatingChar = '\n',
        capacity = 4096 }) {
        super();
        this.terminatingChar = new TextEncoder().encode(terminatingChar)[0] ?? 10;
        this.capacity = capacity ?? 4096;
        this._bytesBuilder = new Uint8Array(this.capacity);
    }

    public getData(): Uint8Array {
        return this._bytesBuilder.slice(0, this._bytesBuilder.length);
    }

    public append(data: Uint8Array): void {
        if (this.isOverFlow(data)) {
            throw new BufferOverFlowError('Byte Buffer Overflow');
        } else {
            this._bytesBuilder.set(data, this._bytesBuilder.length);
        }
    }

    public isOverFlow(data: Uint8Array): boolean {
        return this._bytesBuilder.length + data.length > this.capacity;
    }

    public isEnd(): boolean {
        return this._bytesBuilder.indexOf(this._bytesBuilder.length - 1)?.toString() === this.terminatingChar;
    }

    public isFull(): boolean {
        return this._bytesBuilder.length >= this.capacity;
    }

    public clear(): void {
        this._bytesBuilder.fill(0);
    }

    public length(): number {
        return this._bytesBuilder.length;
    }

    public addByte(byte: number): void {
        this._bytesBuilder.set([byte], this._bytesBuilder.length);
    }
}