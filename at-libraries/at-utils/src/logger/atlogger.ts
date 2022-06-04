import { createLogger, format, Logger, transports } from "winston";

export class AtLogger {
    private readonly _loggerName: string;
    private _filename?: string;
    /**
     * Creates an instance of at logger.
     * @param loggerName 
     * @param [filename] - File is optional unless you want to log to a file
     */
    public constructor(loggerName: string, filename?: string) {
        this._loggerName = loggerName;
        if (filename) {
            this._filename = filename;
        }
    }

    public debug(message: any, optionalParams?: any[]): void {
        this.logger('debug', message, optionalParams).debug(message);
    }

    public finer(message: any, optionalParams?: any[]): void {
        this.logger('finer', message, optionalParams).info(message);
    }

    public info(message: any, optionalParams?: any[]): void {
        this.logger('info', message, optionalParams).info(message);
    }

    public warn(message: any, optionalParams?: any[]): void {
        this.logger('warn', message, optionalParams).warn(message);
    }

    public error(message: any, optionalParams?: any[]): void {
        this.logger('error', message, optionalParams).error(new Error(message));
    }

    public exception(exceptionType: Error, optionalParams?: any[]): void {
        this.logger('exception', exceptionType.message, optionalParams).error(exceptionType);
    }

    private logger(logLevel: string, message: string, optionalParams?: any[] | null): Logger {
        return createLogger({
            level: logLevel || 'info',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.errors({ stack: true }),
                format.printf(({ level, timestamp, stack }) => {
                    return `${timestamp} | ${level.toUpperCase()} | ${this._loggerName} - ${stack || message} ${optionalParams == null || !optionalParams || optionalParams.length == 0 ? '' : JSON.stringify(optionalParams)}`;
                })
            ),
            transports:
                this._filename != null ?
                    [
                        new transports.Console(),
                        new transports.File({ filename: this._filename })
                    ]
                    :
                    [new transports.Console()]
        });
    }
}

