import {createLogger, format, transports, Logger} from 'winston'
import { v4 as uuid } from "uuid";
import fs from "fs";

const { combine, timestamp, label, prettyPrint } = format;
const logFilePrefix = 'combined-';
const logFileExtension = '.log';
export class CustomLogger{
    public logger : Logger;
    public logFile: string;
    constructor() {
        this.create();
    }
    private create() {
        this.logFile = this.newLogFile();
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
            // - Write to all logs with level `info` and above to `combined.log`
            new transports.File({ filename: this.logFile}),
                    // - Write all logs error (and above) to Console/terminal
            new transports.Console()
            ]
        });
    }
    public clear() {
        this.create();
    }
    private newLogFile() {
        return this.logDir() + '/' + `${logFilePrefix}${uuid()}${logFileExtension}`;
    }
    private logDir() {
        if (fs.existsSync('/tmp'))
            return '/tmp';
        return __dirname;
    }
}