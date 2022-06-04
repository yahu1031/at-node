import { parse } from 'yaml'
import { existsSync, readFileSync } from 'fs'
import { AtLogger } from '../logger/atlogger';
import './../utils/ext-helper';

/** 
 * Application Configuration class
 */
export class ApplicationConfiguration {
    private yamlMap?: string;
    private _logger = new AtLogger('ApplicationConfiguration');
    constructor(configPath: string) {
        if (configPath.isEmpty()) {
            this._logger.error('Configuration file path is empty');
        }
        if (existsSync(configPath)) {
            this.yamlMap = readFileSync(configPath, 'utf8');
            parse(this.yamlMap);
        } else {
            this._logger.error('Configuration file not found');
        }
    }

    getYaml(): string | undefined {
        return this.yamlMap;
    }
}
