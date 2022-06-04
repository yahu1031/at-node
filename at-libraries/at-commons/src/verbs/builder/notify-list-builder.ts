import { VerbBuilder } from ".";

export class NotifyListVerbBuilder implements VerbBuilder {
    fromDate?: string | null;
    toDate?: string | null;
    regex?: RegExp | string | null;

    public buildCommand(): string {
        var command = 'notify:list';
        if (this.fromDate != null) {
            command += `:${this.fromDate}`;
        }
        if (this.toDate != null) {
            command += `:${this.toDate}`;
        }
        if (this.regex != null) {
            command += `:${this.regex}`;
        }
        return command += '\n';
    }

    checkParams(): boolean {
        var isValid = true;
        var toDate = new Date(this.toDate!);
        var fromDate = new Date(this.fromDate!);
        try {
            if (toDate.getMilliseconds() <
                fromDate.getMilliseconds()) {
                isValid = false;
            }
        } catch (e) {
            return false;
        }
        return isValid;
    }
}
