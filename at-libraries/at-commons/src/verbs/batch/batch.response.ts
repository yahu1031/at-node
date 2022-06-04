import { IResponse } from "..";

interface IBatchResponse {
    id?: number;
    response?: IResponse;
}


export class BatchResponse {

    public static fromJson(json: string): IBatchResponse {
        return JSON.parse(json);
    }

    toJson(value: IBatchResponse) {
        return JSON.stringify(value)
    };
}
