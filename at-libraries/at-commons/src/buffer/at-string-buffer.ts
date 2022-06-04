import { BufferOverFlowError } from "../errors";
import { AAtBuffer } from ".";

export class StringBuffer extends AAtBuffer<string>{

    constructor(capacity?: number, terminatingChar?: string) {
        super();
        this.capacity = capacity ?? 4096;
        this.terminatingChar = terminatingChar ?? '\n';
        this.message = '';
    }

    public canAppend(data: string): boolean {
        return this.length() + data.length <= this.capacity;
    }

    public getData(): string | undefined {
        return this.message;
    }
    
    public isFull(): boolean {
        return this.message !== null && this.message !== undefined && this.length() >= this.capacity;
    }
    
    public isEnd(): boolean {
        return this.message!.endsWith(this.terminatingChar.toString());
    }
    
    public clear(): void {
        this.message = '';
    }
    
    public length(): number {
        return this.message!.length;
    }


    public append(data: string): void {
        if (this.canAppend(data)) {
            this.message = this.message! + data;
        } else {
            throw new BufferOverFlowError("String buffer overflow");
        }
    }

}