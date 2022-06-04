interface IBatchRequest {
    id?: number;
    command?: string;
}

export class BatchRequest {
    fromJson(json: string): IBatchRequest {
        return JSON.parse(json);
    }

    public static toJson(value: IBatchRequest): string {
        return JSON.stringify(value);
    }
}
