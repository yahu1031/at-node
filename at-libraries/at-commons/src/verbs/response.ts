import { AtError } from "../errors";

export interface IResponse {
    data?: string;
    type?: string;
    isError: boolean;
    errorMessage?: string;
    errorCode?: string;
    atException?: AtError;
    isStream: boolean;
}


export class Response {

    public static fromJson(json: string): IResponse {
        return JSON.parse(json);
    }

    public static toJson(value: IResponse): string {
        var jsonMap = new Map<string, string>();
        if (value.data != null) {
            jsonMap.set('data', value.data);
        }
        if (value.errorCode != null) {
            jsonMap.set('error_code', value.errorCode);
        }
        if (value.errorMessage != null) {
            jsonMap.set('error_message', value.errorMessage);
        }
        return JSON.stringify(jsonMap);
    }
}