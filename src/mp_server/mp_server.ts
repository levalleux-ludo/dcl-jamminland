import bodyParser from "body-parser";
import express from "express";
import { v4 as uuid } from "uuid";
import { NotesRecord, INotesPerInstrument } from "./i_multiplayer";
import { CustomLogger } from "./custom_logger";
import { Mutex } from "async-mutex";

const app = express();

const port = 5611;

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  next();
});
// Body parser
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Logger
const customLogger = new CustomLogger();
customLogger.logger.info("TEST LOGGER");


// function logRequest(req: express.Request, res: express.Response, next: any) {
//     customLogger.logger.info(req.url)
//     next()
// }
// app.use(logRequest)

function logError(err: any, req: express.Request, res: express.Response, next: any) {
    customLogger.logger.error(err)
    res.status(500).send(err)
    next()
}
app.use(logError)

// Listen on port xxxx
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server is booming on port ${port}
Visit http://localhost:${port}`);
});

// class Mutex {
//     private mutex = Promise.resolve();
  
//     lock(): PromiseLike<() => void> {
//       let begin: (unlock: () => void) => void = unlock => {};
  
//       this.mutex = this.mutex.then(() => {
//         return new Promise(begin);
//       });
  
//       return new Promise(res => {
//         begin = res;
//       });
//     }
//     async dispatch<T>(fn: (() => T) | (() => PromiseLike<T>)): Promise<T> {
//         const unlock = await this.lock();
//         try {
//           return await Promise.resolve(fn());
//         } finally {
//           unlock();
//         }
//       }
// }

class MpServer {
    lastRequestTimePerClient: {[key: string]: number} = {};
    notesForClient: {[key: string]: NotesRecord} = {};
    inactiveDelay = 120000; // 2 min

    mutex: Mutex = new Mutex();

    constructor() {
    }

    private createClient(): string {
        const id = uuid();
        this.notesForClient[id] = new NotesRecord();
        this.lastRequestTimePerClient[id] = Date.now();
        return id;    
    }
      
    private  deleteClient(id: string) {
        customLogger.logger.info("delete client with id " + id);
        if (this.lastRequestTimePerClient[id]) { delete this.lastRequestTimePerClient[id]; }
        if (this.notesForClient[id]) { delete this.notesForClient[id]; }
    }

    public async pushNotes(instrument: string, newNotes: string[]): Promise<any> {
        return this.mutex.runExclusive(() => {
            const now = Date.now();
            const inactiveClients = [];
            for (const client in this.notesForClient) {
                if (this.notesForClient.hasOwnProperty(client)) {
                    const lastRequestTimeForClient = this.lastRequestTimePerClient[client];
                    if ((now - lastRequestTimeForClient) > this.inactiveDelay) {
                        inactiveClients.push(client);
                    } else {
                        this.notesForClient[client].mergeNotes(instrument, newNotes);
                    }
                }
            }
            for(let client of inactiveClients) {
                this.deleteClient(client);
            }
            // inactiveClients.forEach((client: string) => {});
            return { status: "OK"};
        })
    }

    public async register(): Promise<any> {
        return this.mutex.runExclusive(() => {
            const id = this.createClient();
            customLogger.logger.info("register a new client -> id=" + id);
            return `{"id": "${id}"}`;    
        })
    }

    public async checkClient(client: string): Promise<boolean> {
        return this.mutex.runExclusive(async () => {
            let lastRequestForClient = this.lastRequestTimePerClient[client];
            if (!lastRequestForClient) return false;
            lastRequestForClient = Date.now();
            return true;
        })
    }

    public async popNotes(client: string): Promise<INotesPerInstrument> {
        return this.mutex.runExclusive(async () => {
            const notesRecord = this.notesForClient[client];
            if (!notesRecord) {
                return {};
            }
            let notesPerInstrument = notesRecord.notesPerInstrument;
            notesRecord.reset();
            return notesPerInstrument;
        })
    }
    
}

const mpServer = new MpServer();


// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Jammin'Land Multiplayer Server");
});

app.post("/play", (req, res) => {
    const {instrument, notes} = req.body;
    mpServer.pushNotes(instrument, notes).then((response) => {
        res.send(response);
    });
});

// app.post("/log/clear", (req, res) => {
//     try {
//         const {instrument, notes} = req.body;
//         let response = mpServer.pushNotes(instrument, notes);
//         res.send(response);
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

app.get("/register", (req, res) => {
    mpServer.register().then((response) => {
        res.send(response);
    })
});

app.get("/log", (req, res) => {
    res.sendFile(customLogger.logFile);
});

app.post("/clearlog", (req, res) => {
    customLogger.clear();
    customLogger.logger.info("New logFile at " + new Date(Date.now()).toString())
    res.status(200).send();
});

app.get("/notes", (req, res) => {
    const client = req.query.client;
    if (!client) {
        res.status(403).send(
        "Client must register to get an ID and then specify this ID as request parameter '?client=xxx'"
        );
        return;
    }
    mpServer.checkClient(client).then((isOK) => {
        if (!isOK) {
            res.status(401).send(
            "Unknown client " + client + ". Please register"
            );
            return;
        }
        mpServer.popNotes(client).then((response) => {
            res.json(response);
        })
    })
});
  
