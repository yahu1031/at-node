import { AtError } from "@sign/at-commons";

/// AtLookUpException class
export class AtLookUpError extends AtError {
    constructor(message: string, errorCode?: string) {
        super(message);
        this.errorCode = errorCode ?? 'AT0014';
    }
}
