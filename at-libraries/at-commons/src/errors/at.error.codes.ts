export const errorCodes: Map<string, string> = new Map<string, string>([
    ['AtServerError', 'AT0001'], //
    ['DataStoreError', 'AT0002'], // 
    ['InvalidSyntaxError', 'AT0003'], //
    ['SocketError', 'AT0004'], //
    ['BufferOverFlowError', 'AT0005'],//
    ['OutboundConnectionLimitError', 'AT0006'], //
    ['SecondaryNotFoundError', 'AT0007'], //
    ['HandShakeError', 'AT0008'], //
    ['UnAuthorizedError', 'AT0009'], //
    ['InternalServerError', 'AT0010'], //
    ['InternalServerException', 'AT0011'], //
    ['InboundConnectionLimitError', 'AT0012'], //
    ['BlockedConnectionError', 'AT0013'], //
    ['AtClientError', 'AT0014'], //
    ['KeyNotFoundError', 'AT0015'], //
    ['SecondaryConnectError', 'AT0021'], //
    ['IllegalArgumentError', 'AT0022'], //
    ['AtTimeoutError', 'AT0023'], //
    ['UnAuthenticatedError', 'AT0401'], //
]);

export const errorMessages: Map<string, string> = new Map<string, string>([
    ['AT0001', 'Server Error'],
    ['AT0002', 'Data store Error'],
    ['AT0003', 'Invalid syntax'],
    ['AT0004', 'Socket Error'],
    ['AT0005', 'Buffer limit exceeded'],
    ['AT0006', 'Outbound connection limit exceeded'],
    ['AT0007', 'Secondary server not found'],
    ['AT0008', 'Handshake failure'],
    ['AT0009', 'UnAuthorized client in request'],
    ['AT0010', 'Internal server Error'],
    ['AT0011', 'Internal server Error'],
    ['AT0012', 'Inbound connection limit exceeded'],
    ['AT0013', 'Connection Error'],
    ['AT0014', 'Unknown AtClient Error'],
    ['AT0015', 'key not found'],
    ['AT0021', 'Unable to connect to secondary'],
    ['AT0022', 'Illegal arguments'],
    ['AT0023', 'Timeout waiting for response'],
    ['AT0401', 'Client authentication failed']
]);