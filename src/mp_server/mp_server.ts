import bodyParser from "body-parser";
import express from "express";
import { v4 as uuid } from "uuid";
import { NotesRecord, INotesPerInstrument } from "./i_multiplayer";
import { CustomLogger } from "./custom_logger";

const app = express();

const port = 5611;

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

class MpServer {
    lastRequestTimePerClient: {[key: string]: number} = {};
    notesForClient: {[key: string]: NotesRecord} = {};
    inactiveDelay = 120000; // 2 min

    constructor() {
    }

    public createClient(): string {
        const id = uuid();
        this.notesForClient[id] = new NotesRecord();
        this.lastRequestTimePerClient[id] = Date.now();
        return id;
    }
      
    public deleteClient(id: string) {
        customLogger.logger.info("delete client with id " + id);
        if (this.lastRequestTimePerClient[id]) { delete this.lastRequestTimePerClient[id]; }
        if (this.notesForClient[id]) { delete this.notesForClient[id]; }
    }

    public pushNotes(instrument: string, newNotes: string[]): any {
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
        inactiveClients.forEach((client) => {this.deleteClient(client); });
        return { status: "OK"};
    }

    public register(): any {
        const id = this.createClient();
        customLogger.logger.info("register a new client -> id=" + id);
        return `{"id": "${id}"}`;
    }

    public checkClient(client: string) {
        let lastRequestForClient = this.lastRequestTimePerClient[client];
        if (!lastRequestForClient) return false;
        lastRequestForClient = Date.now();
        return true;
    }

    public popNotes(client: string): INotesPerInstrument {
        const notesRecord = this.notesForClient[client];
        if (!notesRecord) {
            return {};
        }
        let notesPerInstrument = notesRecord.notesPerInstrument;
        notesRecord.reset();
        return notesPerInstrument;
    }
    
}

const mpServer = new MpServer();


// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Jammin'Land Multiplayer Server");
});

app.post("/play", (req, res) => {
    const {instrument, notes} = req.body;
    let response = mpServer.pushNotes(instrument, notes);
    res.send(response);
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
    res.send(mpServer.register());
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
    if (!mpServer.checkClient(client)) {
        res.status(401).send(
        "Unknown client " + client + ". Please register"
        );
        return;
    }
    res.json(mpServer.popNotes(client));
});
  
